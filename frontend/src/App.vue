
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
import { mapMutations, mapGetters } from "vuex";
import { EventBus } from "./event-bus";

import { WSJoin, WSCommand } from "./types";

// if (!process.env.PROD) {
//   import("@vue/devtools").then(devtools => {
//     devtools.connect(process.env.BASEURL);
//   });
// }

export default defineComponent({
  name: "App",
  computed: {
    ...mapGetters("config", ["httpBaseUrl", "buildMode"])
  },
  beforeMount() {
    this.setBuildMode(process.env.MODE);
  },
  methods: {
    ...mapMutations("config", ["setHttpBaseUrl", "setApiVersion", "setSioConnected", "setBuildMode"]),
    connectSio(sioUrl: string) {
      // connect to the SIO API
      const s = io(sioUrl);

      s.on("connect", () => {
        // console.log(`New socket.io connection with ID ${s.id}`);
        this.setSioConnected(true);
      });

      s.on("disconnect", () => {
        this.setSioConnected(false);
      });

      s.on("join", (payload: WSJoin) => {
        console.log(`SIO API version ${payload.version} connected.`);
        this.setApiVersion(payload.version);
      });

      s.on("wsCommand", (message: WSCommand) => {
        console.log(`Received SIO message: ${message.command}.`);
        EventBus.$emit(message.command, message.data);
      });

      EventBus.$on("wsCommand", (message: WSCommand) => {
        s.emit("wsCommand", message);
      });
    }
  },
  async mounted() {
    if (this.buildMode === "capacitor") {
      const { SplashScreen } = Plugins;

      // Hide the splash
      await SplashScreen.hide();

      Zeroconf.watch("_kCharge-http._tcp.", "local.").subscribe(result => {
        if (result.action === "resolved") {
          const httpUrl = `http://${result.service.ipv4Addresses[0]}:${result.service.port}`;

          // set the axios base url
          console.log(`kCharge HTTP API found at: ${httpUrl}`);
          this.setHttpBaseUrl(httpUrl);
        }
      });

      Zeroconf.watch("_kCharge-sio._tcp.", "local.").subscribe(result => {
        if (result.action === "resolved") {
          const sioUrl = `http://${result.service.ipv4Addresses[0]}:${result.service.port}`;

          // we found the SIO API
          console.log(`kCharge SIO (SocketIO) API found at: ${sioUrl}`);
          this.connectSio(sioUrl);
        }
      });

      Zeroconf.watch("_kCharge-wss._tcp.", "local.").subscribe(result => {
        if (result.action === "resolved") {
          console.log(`kCharge WSS (WS Server) found at: http://${result.service.ipv4Addresses[0]}:${result.service.port}`);
        }
      });
    }
    else if (this.buildMode === "spa") {
      // quasar ensures we always get a default value
      this.setHttpBaseUrl(`${process.env.BASEURL as string }:3000`);
      this.connectSio(`${process.env.BASEURL as string }:8080`);
    }
  },
});
</script>
