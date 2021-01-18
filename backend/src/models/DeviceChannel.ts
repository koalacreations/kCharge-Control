/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  Unique,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Device } from "./Device";
import { Cell } from "./Cell";

@Entity()
@Unique(["id"])
// eslint-disable-next-line import/export
export class DeviceChannel extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  channelId!: number;

  @Column()
  state!: DeviceChannel.DeviceChannelState;

  @Column({ type: "text", nullable: true })
  stage!: string | null;

  @Column()
  current!: number;

  @Column()
  voltage!: number;

  @Column({ type: "text", nullable: true })
  temperature!: number | null;

  @ManyToOne(() => Device, (device) => device.deviceChannels, {
    eager: true,
  })
  device!: Device;

  @OneToOne(() => Cell, {
    eager: true,
  })
  cell!: Cell;

  @Column({ default: () => Math.floor(new Date().getTime() / 1000) })
  created!: number;
}

// eslint-disable-next-line no-redeclare, import/export
export namespace DeviceChannel {
  // eslint-disable-next-line no-shadow
  export enum DeviceChannelState {
    empty = "empty",
    idle = "idle",
    complete = "complete",
    charging = "charging",
    discharging = "discharging",
    overVoltage = "overVoltage",
    underVoltage = "underVoltage",
    overTemperature = "overTemperature",
    error = "error",
  }
}
