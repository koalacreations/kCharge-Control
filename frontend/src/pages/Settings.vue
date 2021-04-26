<template>
  <q-page>
    <div
      class="q-pt-md"
    >
      <div>
        <p>This page lets you check the currently configured settings of this application.</p>

        <p>
          <b>HTTP API Url: </b>{{ httpBaseUrl }} <br>
          <b>SIO API Url: </b>{{ httpBaseUrl }} <br>
          <b>API Version: </b>{{ apiVersion }} <br>
        </p>

        <p>
          Please be aware that kCharge Control automatically looks for compatible servers on your network. Your network must support mDNS services for this to work.
        </p>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" >
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineComponent } from "@vue/composition-api";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "Settings",
  components: {
  },
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    ...mapGetters("config", ["httpBaseUrl", "apiVersion"]),
  },
});
</script>
