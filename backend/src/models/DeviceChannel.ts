/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  OneToOne,
  JoinColumn
} from "typeorm";
import { Device } from "./Device";
import { Cell, ICell } from "./Cell";

@Entity()
@Unique(["id"])
// eslint-disable-next-line import/export
export class DeviceChannel extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

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

  @ManyToOne(() => Device, (device) => device.deviceChannels)
  device!: Device;

  @OneToOne(() => Cell, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
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

  export interface IDeviceChannel {
    id: number;
    channelId: string;
    state: DeviceChannel.DeviceChannelState;
    stage?: string;
    current: number;
    voltage: number;
    temperature: number | null;
    cell?: ICell;
  }
}
