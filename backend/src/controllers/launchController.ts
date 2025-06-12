import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Launch } from "../models/Launch";

export class LaunchController {
  create = async (req: Request, res: Response): Promise<void> => {
    const repo = AppDataSource.getRepository(Launch);
    const { description, amount, date, type } = req.body;

    if (!description || !amount || !date || !type) {
      res.status(400).json({ message: "Todos os campos sao obrigatorios: description, amount, date, type" });
      return;
    }
    const launch = repo.create({ description, amount, date, type });
    await repo.save(launch);

    res.status(201).json(launch);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const repo = AppDataSource.getRepository(Launch);
    const launches = await repo.find();

    res.status(200).json(launches);
  };

  public getOne = async (req: Request, res: Response): Promise<void> => {
    const repo = AppDataSource.getRepository(Launch);
    const { id } = req.params;
    const launch = await repo.findOneBy({ id: Number(id) });

    if (launch) {
      res.status(200).json(launch);
    } else {
      res.status(404).json({ message: "Lançamento não encontrado" });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const repo = AppDataSource.getRepository(Launch);
    const { id } = req.params;

    const launch = await repo.findOneBy({ id: Number(id) });

    if (launch) {
      // O merge atualiza a entidade 'launch' com os dados do 'req.body'
      repo.merge(launch, req.body);
      const updatedLaunch = await repo.save(launch);
      res.status(200).json(updatedLaunch);
    } else {
      res.status(404).json({ message: "Lançamento não encontrado" });
    }
  };

  public remove = async (req: Request, res: Response): Promise<void> => {
    const repo = AppDataSource.getRepository(Launch);
    const { id } = req.params;

    const launchToRemove = await repo.findOneBy({ id: Number(id) });

    if (launchToRemove) {
      await repo.remove(launchToRemove);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Lançamento não encontrado" });
    }
  };

  public listByMonth = async (req: Request, res: Response): Promise<void> => {
  const { year, month } = req.query;

  if (!year || !month) {
    res.status(400).json({ message: "Ano e mês são obrigatórios" });
    return;
  }

  const repo = AppDataSource.getRepository(Launch);
  const launches = await repo.createQueryBuilder("launch")
    .where("EXTRACT(YEAR FROM launch.date AT TIME ZONE 'UTC') = :year", { year })
    .andWhere("EXTRACT(MONTH FROM launch.date AT TIME ZONE 'UTC') = :month", { month })
    .orderBy("launch.date", "ASC")
    .getMany();

  res.status(200).json(launches);
};

}