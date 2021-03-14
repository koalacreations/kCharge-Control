import Vue from "vue";
import { AxiosInstance } from "axios";

interface ConfigSTATE {
  httpBaseUrl: string;
  apiVersion: string;
  sioConnected: boolean;
  buildMode: string;
}

export default {
  namespaced: true,
  state: {
    httpBaseUrl: "",
    apiVersion: "",
    sioConnected: false,
    buildMode: "",
  },
  getters: {
    httpBaseUrl: (state: ConfigSTATE) => state.httpBaseUrl,
    apiVersion: (state: ConfigSTATE) => state.apiVersion,
    sioConnected: (state: ConfigSTATE) => state.sioConnected,
    buildMode: (state: ConfigSTATE) => state.buildMode,
  },
  mutations: {
    setHttpBaseUrl(state: ConfigSTATE, payload: string) {
      state.httpBaseUrl = payload;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (Vue.prototype.$axios as AxiosInstance).defaults.baseURL = payload;
    },
    setApiVersion(state: ConfigSTATE, payload: string) {
      state.apiVersion = payload;
    },
    setSioConnected(state: ConfigSTATE, payload: boolean) {
      state.sioConnected = payload;
    },
    setBuildMode(state: ConfigSTATE, payload: string) {
      state.buildMode = payload;
    }
  },
};
