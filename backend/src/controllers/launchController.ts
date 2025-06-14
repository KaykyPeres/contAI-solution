import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Launch } from "../models/Launch";

export class LaunchController {

  public create = async (req: Request, res: Response): Promise<void> => {
    const repo = AppDataSource.getRepository(Launch);
    const { description, amount, date, type } = req.body;

    if (!description || !amount || !date || !type) {
      res.status(400).json({ message: "Todos os campos são obrigatórios: description, amount, date, type" });
      return;
    }
    const launch = repo.create({ description, amount, date, type });
    await repo.save(launch);

    res.status(201).json(launch);
  };

  public list = async (req: Request, res: Response): Promise<void> => {
    const repo = AppDataSource.getRepository(Launch);
    const launches = await repo.find();

    res.status(200).json(launches);
  };

  public getOne = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido. Deve ser um número." });
      return;
    }

    const repo = AppDataSource.getRepository(Launch);
    const launch = await repo.findOneBy({ id: id });

    if (launch) {
      res.status(200).json(launch);
    } else {
      res.status(404).json({ message: "Lançamento não encontrado" });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido. Deve ser um número." });
      return;
    }

    const repo = AppDataSource.getRepository(Launch);
    const launch = await repo.findOneBy({ id: id });

    if (launch) {
      repo.merge(launch, req.body);
      const updatedLaunch = await repo.save(launch);
      res.status(200).json(updatedLaunch);
    } else {
      res.status(404).json({ message: "Lançamento não encontrado" });
    }
  };

  public remove = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "ID inválido. Deve ser um número." });
      return;
    }

    const repo = AppDataSource.getRepository(Launch);
    const launchToRemove = await repo.findOneBy({ id: id });

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