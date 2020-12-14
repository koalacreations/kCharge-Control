/* eslint-disable import/prefer-default-export */
import {
  BaseEntity, Entity, Column, PrimaryColumn, Unique, ManyToOne,
} from "typeorm";
import { CellType } from "./CellType";

@Entity()
@Unique(["id"])
// eslint-disable-next-line import/export
export class Cell extends BaseEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    state: Cell.CellState;

    @ManyToOne(() => CellType, (cellType) => cellType.cells)
    cellType: CellType;

    @Column({ default: () => Math.floor(new Date().getTime() / 1000) })
    created: number;
}

// eslint-disable-next-line no-redeclare, import/export
export namespace Cell {
  // eslint-disable-next-line no-shadow
  export enum CellState {
  New = "new",
  Charging = "charging",
  Charged = "charged",
  Discharging = "discharging",
  Discharged = "discharged",
  Error = "error",
  VoltageHigh = "voltagehigh",
  VoltageLow = "voltagelow"
}
}
