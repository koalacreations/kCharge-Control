<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts" >
/* eslint-disable no-console */
import { io } from "socket.io-client";
import { defineComponent } from "@vue/composition-api";
import { Plugins } from "@capacitor/core";
import { WSJoin } from "./types";

const { SplashScreen } = Plugins;

export default defineComponent({
  name: "App",
  mounted() {
    // Hide the splash (you should do this on app launch)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    SplashScreen.hide();

    const s = io();

    s.on("connect", () => {
      console.log(`New socket.io connection with ID ${s.id}`);
    });

    s.on("join", (payload: WSJoin) => {
      console.log(payload.message);
      console.log(`Server version: ${payload.version}`);
    });

    s.on("devices", (payload: string) => {
      console.log(payload);
    });
  },
});
</script>
