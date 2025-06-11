import { DataSource } from "typeorm";
import { Launch } from "./models/Launch";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "seu_usuario",
  password: "sua_senha",
  database: "sistema_contabil",
  synchronize: true,
  logging: true,
  entities: [Launch],
});