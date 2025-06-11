import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Launch } from "../models/Launch";

export class LaunchController {
  // Método para criar lançamento
  create = async (req: Request, res: Response): Promise<Response> => {
    const repo = AppDataSource.getRepository(Launch);

    const { description, amount, category, type } = req.body;

    if (!description || !amount || !category || !type) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes" });
    }

    const launch = repo.create({ description, amount, type });

    await repo.save(launch);

    return res.status(201).json(launch);
  };

  // Método para listar lançamentos
  list = async (req: Request, res: Response): Promise<Response> => {
    const repo = AppDataSource.getRepository(Launch);
    const launches = await repo.find();
    return res.status(200).json(launches);
  };
}