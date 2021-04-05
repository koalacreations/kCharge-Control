import devices from "./devices";
import device from "./device";

export default [
  {
    method: "GET",
    path: "/api/devices/",
    handler: devices.get,
  },
  { method: "GET", path: "/api/devices/{id}/", handler: device.get },
];
