<template>
  <div class="column justify-center device-container q-pa-md">
    <div class="text-h5 q-mb-md text-center">
      {{ name || "Unnamed Device" }} <q-btn round outline size="sm" :icon="icons.info" @click="showInfo" />
    </div>

    <div class="row justify-center q-gutter-md">
      <cell
        v-for="index in device.channels"
        :key="index"
        :cell="index"
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
    icons()  {
      return icons;
    },
  },
  methods: {
    showInfo() {
      this.$q.dialog({
        title: this.device.deviceName || "Unnamed Device",
        message: `<strong>Device Details:</strong> <br> Manufacturer: ${this.device.deviceManufacturer} <br> Model: ${this.device.deviceModel} <br> Capabilities: ${JSON.stringify(this.device.capabilities)}`,
        html: true
      })
    }
  }
});
</script>

<style lang="scss" scoped>
.device-container {
  background: $primary;
  border-radius: 10px;
}
</style>
