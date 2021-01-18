import Vue from "vue";
import axios, { AxiosInstance } from "axios";
import { boot } from "quasar/wrappers";

declare module "vue/types/vue" {
  interface Vue {
    prototype: {
      $axios: AxiosInstance;
    };
    $axios: AxiosInstance;
  }
}

type Context = {
  Vue: Vue;
};

export default ({ Vue: vue }: Context) => {
  axios.defaults.baseURL = process.env.APIURL;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  vue.prototype.$axios = axios;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$axios = axios;
};
