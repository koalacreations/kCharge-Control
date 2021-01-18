import Vue from "vue";
import { Commit } from "vuex";
import { AxiosInstance } from "axios";
import { IDevice } from "../../../backend/src/models/Device";

interface IDeviceSTATE {
  devices: Array<IDevice>;
}

export default {
  namespaced: true,
  state: {
    devices: []
  },
  getters: {
    devices: (state: IDeviceSTATE) => state.devices
  },
  mutations: {
    setDevices(state: IDeviceSTATE, payload: Array<IDevice>) {
      state.devices = payload;
    }
  },
  actions: {
    getDevices({ commit }: { commit: Commit }) {
      return new Promise<void>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (Vue.prototype.$axios as AxiosInstance)
          .get("/api/devices/")
          .then(result => {
            commit("setDevices", result.data);
            resolve();
          })
          .catch(error => {
            reject();
            throw error;
          });
      });
    }
  }
};
