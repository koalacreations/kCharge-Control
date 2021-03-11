<template>
  <q-page>
    <div
      v-if="!devices.length"
      class="q-pt-md text-center"
    >
      <q-icon
        :name="icons.noDevices"
        style="opacity: 20%;"
        class="q-py-md"
        size="10em"
      />

      <p>
        No jCharge testing device was found on the local network. Make sure your device is powered on and connected to WiFi.
      </p>
    </div>

    <template v-else>
      <div class="column">
        <div class="text-h4 q-py-md">
          {{ title }}
        </div>

        <div class="row q-gutter-md">
          <template
            v-for="device in devices"
          >
            <device-card
              :key="device.id"
              :device="device"
            />
          </template>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script lang="ts" >
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineComponent } from "@vue/composition-api";
import { mapActions, mapGetters } from "vuex";
import DeviceCard from "@components/DeviceCard.vue";
import icons from "../icons";

export default defineComponent({
  name: "Dashboard",
  components: {
    DeviceCard,
  },
  data() {
    return {};
  },
  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (this.httpBaseUrl) this.getDevices(); // if we have a baseUrl then fetch devices
  },
  methods: {
    ...mapActions("devices", ["getDevices"]),
  },
  computed: {
    ...mapGetters("devices", ["devices"]),
    ...mapGetters("config", ["httpBaseUrl"]),
    icons() {
      return icons;
    },
    title(): string {
      return `Found ${this.devices.length} device${this.devices.length >1 ? "s" : ""}.`;
    }
  },
  watch: {
    async httpBaseUrl() {
      await this.getDevices();
    }
  }
});
</script>
