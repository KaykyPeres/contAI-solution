import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum LaunchType {
  CREDITO = "Crédito",
  DEBITO = "Débito",
}

@Entity()
export class Launch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: LaunchType,
    default: LaunchType.DEBITO,
  })
  type: LaunchType;

  @Column()
  date: Date;
}