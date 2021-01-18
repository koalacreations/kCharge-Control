/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { DeviceChannel } from "./DeviceChannel";

@Entity()
@Unique(["id"])
// eslint-disable-next-line import/export
export class Device extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: "text", nullable: true })
  deviceName!: string | null;

  @Column({ type: "text", nullable: true })
  deviceManufacturer!: string | null;

  @Column({ type: "text", nullable: true })
  deviceModel!: string | null;

  @Column()
  channels!: number;

  @Column({ default: () => false })
  charge!: boolean;

  @Column({ default: () => false })
  discharge!: boolean;

  @Column({ default: () => false })
  configurableChargeCurrent!: boolean;

  @Column({ default: () => false })
  configurableDischargeCurrent!: boolean;

  @Column({ default: () => false })
  configurableChargeVoltage!: boolean;

  @Column({ default: () => false })
  configurableDischargeVoltage!: boolean;

  @OneToMany(() => DeviceChannel, (deviceChannel) => deviceChannel.device)
  deviceChannels!: DeviceChannel[];

  @Column({ default: () => Math.floor(new Date().getTime() / 1000) })
  created!: number;
}

export interface IDevice {
  id: string;
  deviceName: string | null;
  deviceManufacturer: string | null;
  deviceModel: string | null;
  capabilities: {
    channels: number;
    charge: boolean;
    discharge: boolean;
    configurableChargeCurrent: boolean;
    configurableDischargeCurrent: boolean;
    configurableChargeVoltage: boolean;
    configurableDischargeVoltage: boolean;
  };
}

export interface IDeviceConnection {
  device: IDevice;
  deviceId: string;
  // eslint-disable-next-line no-undef
  socket: WebSocket;
}
