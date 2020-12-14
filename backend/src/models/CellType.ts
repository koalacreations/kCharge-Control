/* eslint-disable import/prefer-default-export */
import {
  BaseEntity, Entity, Column, Unique, PrimaryColumn, OneToMany,
} from "typeorm";
import { Cell } from "./Cell";

@Entity()
@Unique(["id"])
export class CellType extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ default: () => Math.floor(new Date().getTime() / 1000) })
    created: number;

    @OneToMany(() => Cell, (cell) => cell.cellType)
    cells: Cell[];
}
