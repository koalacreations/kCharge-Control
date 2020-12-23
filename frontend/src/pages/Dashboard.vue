<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="devices.length">
      No jCharge devices found on the local network.
    </div>
  </q-page>
</template>

<script lang="ts" >
import { defineComponent } from "@vue/composition-api";
import { IDevice } from "../../../backend/src/models/Device";

export default defineComponent({
  name: "Dashboard",
  data() {
    return {
      devices: [] as Array<IDevice>
    };
  }
});
</script>
