<template>
  <q-page>
    <div
      v-if="!devices.length"
      class="q-pt-md"
    >
      No jCharge devices found on the local network.
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
    this.getDevices();
  },
  methods: {
    ...mapActions("devices", ["getDevices"]),
  },
  computed: {
    ...mapGetters("devices", ["devices"]),
    title(): string {
      return `Found ${this.devices.length} device${this.devices.length >1 ? "s" : ""}.`;
    }
  },
});
</script>
