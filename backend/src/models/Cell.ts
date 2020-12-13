/* eslint-disable import/prefer-default-export */
import {
  BaseEntity, Entity, Column, PrimaryColumn, Unique,
} from "typeorm";

@Entity()
@Unique(["id"])
export class Cell extends BaseEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    state: Cell.CellState;

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
