import { Router } from "express";
import { Launch } from "../models/Launch";
import { AppDataSource } from "../data-source";

const router = Router();
const repo = AppDataSource.getRepository(Launch);

router.post("/", async (req, res) => {
  const launch = repo.create(req.body);
  const result = await repo.save(launch);
  res.json(result);
});

router.get("/", async (req, res) => {
  const all = await repo.find();
  res.json(all);
});

export default router;