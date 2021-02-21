<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts" >
/* eslint-disable no-console */
import { io } from "socket.io-client";
import { defineComponent } from "@vue/composition-api";
import { WSJoin } from "./types";

export default defineComponent({
  name: "App",
  mounted() {
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
