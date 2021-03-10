import Vue from "vue";
import { AxiosInstance } from "axios";

interface ConfigSTATE {
  httpBaseUrl: string;
}

export default {
  namespaced: true,
  state: {
    httpBaseUrl: ""
  },
  getters: {
    httpBaseUrl: (state: ConfigSTATE) => state.httpBaseUrl
  },
  mutations: {
    setHttpBaseUrl(state: ConfigSTATE, payload: string) {
      state.httpBaseUrl = payload;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (Vue.prototype.$axios as AxiosInstance).defaults.baseURL = payload;
    }
  },
};
