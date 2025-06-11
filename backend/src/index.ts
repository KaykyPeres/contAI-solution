import 'reflect-metadata';
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import launchRoutes from "./routes/launchRoutes";

AppDataSource.initialize().then(() => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/launches", launchRoutes);
  app.listen(3001, () => console.log("Servidor rodando na porta 3001"));
});