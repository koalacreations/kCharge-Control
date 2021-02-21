<template>
  <q-page>
    <div v-if="!devices.length">
      No jCharge devices found on the local network.
    </div>

    <template v-else>
      <div class="column">
        <div class="text-h4 q-py-md">
          Found {{ devices.length }} device<template v-if="devices.length > 1">
            s
          </template>.
        </div>

        <div class="row">
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
