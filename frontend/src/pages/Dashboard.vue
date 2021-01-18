<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="!devices.length">
      No jCharge devices found on the local network.
    </div>
  </q-page>
</template>

<script lang="ts" >
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineComponent } from "@vue/composition-api";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "Dashboard",
  data() {
    return {};
  },
  mounted() {
    this.getDevices();
  },
  methods: {
    ...mapActions("devices", ["getDevices"]),
  },
  computed: {
    ...mapGetters("devices", ["devices"]),
  },
});
</script>
