import Vue from "vue";
import axios, { AxiosInstance } from "axios";

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  vue.prototype.$axios = axios;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$axios = axios;
};
