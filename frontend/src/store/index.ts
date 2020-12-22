import { store } from "quasar/wrappers";
import Vuex from "vuex";
import devices from "./devices";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  example: unknown;
}

export default store(({ Vue }) => {
  Vue.use(Vuex);

  const Store = new Vuex.Store<StateInterface>({
    modules: {
      devices
    },

    strict: !!process.env.DEBUGGING
  });

  return Store;
});
