<template>
  <div class="column justify-center device-container q-pa-md">
    <div class="text-h5 q-mb-md text-center">
      {{ name }}
      <q-btn
        round
        outline
        size="sm"
        :icon="icons.info"
        @click="showInfo"
      />
    </div>

    <div class="row justify-center q-gutter-sm">
      <cell
        v-for="channel in device.deviceChannels"
        :key="channel.id"
        :channel="channel.channelId"
        :device-id="device.id"
        :voltage="channel.voltage"
        :current="channel.current"
        :status="channel.state"
      />
    </div>
  </div>
</template>

<script lang="ts" >
import { defineComponent } from "@vue/composition-api";
import Cell from "./Cell.vue";
import icons from "../icons/index";
import { IDevice } from "../../../backend/src/types/Device";

export default defineComponent({
  components: { Cell },
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
