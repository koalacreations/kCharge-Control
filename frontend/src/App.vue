
<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts" >
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { io } from "socket.io-client";
import { defineComponent } from "@vue/composition-api";
import { Plugins } from "@capacitor/core";
import { Zeroconf } from "@ionic-native/zeroconf";
import { WSJoin } from "./types";
import { mapMutations, mapGetters } from "vuex";

export default defineComponent({
  name: "App",
  methods: {
    ...mapMutations("config", ["setHttpBaseUrl"])
  },
  computed: {
    ...mapGetters("config", ["httpBaseUrl"])
  },
  async mounted() {
    const { SplashScreen } = Plugins;

    // Hide the splash
    await SplashScreen.hide();

    Zeroconf.watch("_jcharge-http._tcp.", "local.").subscribe(result => {
      if (result.action === "resolved") {
        const httpUrl = `http://${result.service.ipv4Addresses[0]}:${result.service.port}`;

        // set the axios base url
        console.log(`jCharge HTTP API found at: ${httpUrl}`);
        this.setHttpBaseUrl(httpUrl);
      }
    });

    Zeroconf.watch("_jcharge-sio._tcp.", "local.").subscribe(result => {
      if (result.action === "resolved") {
        const sioUrl = `http://${result.service.ipv4Addresses[0]}:${result.service.port}`;

        // we found the SIO API
        console.log(`jCharge SIO (SocketIO) API found at: ${sioUrl}`);

        // connect to the SIO API
        const s = io(sioUrl);

        s.on("connect", () => {
          // console.log(`New socket.io connection with ID ${s.id}`);
        });

        s.on("join", (payload: WSJoin) => {
          console.log(`SocketIO API version ${payload.version} connected.`);
        });

        s.on("devices", (payload: string) => {
          console.log(payload);
        });
      }
    });

    Zeroconf.watch("_jcharge-wss._tcp.", "local.").subscribe(result => {
      if (result.action === "resolved") {
        console.log(`jCharge WSS (WS Server) found at: http://${result.service.ipv4Addresses[0]}:${result.service.port}`);
      }
    });
  },
});
</script>
