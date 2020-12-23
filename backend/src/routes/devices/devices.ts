import { Device } from "../../models/Device";

const get = async () => {
  const device = await Device.find();

  return device;
};

export default { get };
