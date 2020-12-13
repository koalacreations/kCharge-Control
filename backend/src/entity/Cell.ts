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
    state: string;

    @Column({ default: () => Math.floor(new Date().getTime() / 1000) })
    created: number;
}
