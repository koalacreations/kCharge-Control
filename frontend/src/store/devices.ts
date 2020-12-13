import "axios";

export interface devicesState {
  devices: Array<string>
}

export default {
  namespaced: true,
  state: {
    devices: [],
  },
  getters: {
    getDevices: (state: devicesState) => state.devices,
  },
  mutations: {
    setAuth(state: devicesState, payload: Array<string>) {
      state.devices = payload;
    },
  },
};
