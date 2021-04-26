<template>
  <div
    class="column justify-center device-container q-pa-md no-select clickable"
    @click.stop="showInfo"
  >
    <div class="text-h5 q-mb-md text-center title">
      {{ name }}

      <q-icon
        v-if="device.connected"
        class="q-pl-sm success"
        :name="icons.connected"
      >
        <q-tooltip>
          This device is currently connected. Try restarting it if you're having problems.
        </q-tooltip>
      </q-icon>

      <q-icon
        v-else
        class="q-pl-sm error"
        :name="icons.disconnected"
      >
        <q-tooltip>
          This device is currently disconnected.
        </q-tooltip>
      </q-icon>
    </div>

    <div class="row justify-center q-gutter-sm">
      <channel
        v-for="channel in channels"
        :key="channel.id"
        :channel="channel.channelId"
        :device-id="device.id"
        :voltage="channel.voltage"
        :current="channel.current"
        :status="channel.state"
        :capacity="channel.capacity"
      />
    </div>
  </div>
</template>

<script lang="ts" >
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { defineComponent } from "@vue/composition-api";
import Channel from "./Channel.vue";
import icons from "../icons/index";
import { IDevice } from "../../../backend/src/types/Device";
import { DeviceChannel } from "../../../backend/src/models/DeviceChannel";

export default defineComponent({
  components: { Channel },
  name: "DeviceCard",
  props: {
    device: {
      type: Object as () => IDevice,
    },
  },
  computed: {
    icons() {
      return icons;
    },
    name(): string {
      if (this.device?.deviceManufacturer) {
        return this.device?.deviceName || `Unnamed ${this.device?.deviceManufacturer} ${this.device?.deviceModel || "Device"}`;
      }
      return this.device?.deviceName || `Unnamed ${this.device?.deviceModel || "Device"}`;
    },
    channels(): DeviceChannel[] {
      // vuex gets upset if you try to mutate the array directly so we make a copy
      // then we sort it so they are always ordered correctly
      if (this.device) {
        // @ts-ignore
        return [...this.device.deviceChannels].sort((a, b) => a.channelId > b.channelId) ;
      }
      return [];
    }
  },
  methods: {
    showInfo() {
      this.$q.dialog({
        title: this.name,
        message: `Name: ${this.name}<br> Manufacturer: ${
          this.device?.deviceManufacturer || "Unknown"
        } <br> Model: ${
          this.device?.deviceModel || "Unknown"
        } <br> Capabilities: ${JSON.stringify(this.device?.capabilities)} <br> Device ID: ${this.device?.id || "Unspecified ID"}`,
        html: true,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.device-container {
  background: $primary;
  border-radius: 10px;
}
</style>
