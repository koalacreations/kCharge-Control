import axios, { AxiosInstance } from "axios";
import { boot } from "quasar/wrappers";

declare module "vue/types/vue" {
  interface Vue {
    $axios: AxiosInstance;
  }
}

export default boot(({ Vue }) => {
  axios.defaults.baseURL = process.env.APIURL;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$axios = axios;
});
