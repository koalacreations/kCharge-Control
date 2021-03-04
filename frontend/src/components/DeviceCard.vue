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

    <div class="row justify-center q-gutter-md">
      <cell
        v-for="index in device.channels"
        :key="index"
        :cell="index"
        :device-id="device.id"
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
      return this.device?.deviceName || "Unnamed Device";
    }
  },
  methods: {
    showInfo() {
      this.$q.dialog({
        title: this.device?.deviceName || "Unnamed Device",
        message: `<strong>Name:</strong> <br> Manufacturer: ${
          this.device?.deviceManufacturer || "Unknown"
        } <br> Model: ${
          this.device?.deviceModel || "Unknown"
        } <br> Capabilities: ${JSON.stringify(this.device?.capabilities)} <br> Serial: ${JSON.stringify(this.device?.id)}`,
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
