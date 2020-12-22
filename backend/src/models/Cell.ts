/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  Unique,
  ManyToOne,
} from "typeorm";
import { CellType } from "./CellType";

@Entity()
@Unique(["id"])
// eslint-disable-next-line import/export
export class Cell extends BaseEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  state!: Cell.CellState;

  @Column()
  class!: Cell.CellClass;

  @ManyToOne(() => CellType, (cellType) => cellType.cells, {
    eager: true,
  })
  cellType!: CellType;

  @Column({ default: () => Math.floor(new Date().getTime() / 1000) })
  created!: number;
}

// eslint-disable-next-line no-redeclare, import/export
export namespace Cell {
  // eslint-disable-next-line no-shadow
  export enum CellState {
    new = "new",
    charging = "charging",
    charged = "charged",
    discharging = "discharging",
    discharged = "discharged",
    discard = "discard",
  }

  // eslint-disable-next-line no-shadow
  export enum CellClass {
    normal = "normal",
    heater = "heater",
  }
}

export interface ICellType {
  id: string;
  name: string;
}

export interface ICell {
  id: number;
  state: string;
  class: Cell.CellClass;
  cellType: ICellType;
  created: number;
}
