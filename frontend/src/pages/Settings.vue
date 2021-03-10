<template>
  <q-page>
    <div
      class="q-pt-md"
    >
      <h5>
        Settings
      </h5>

      <div>
        <b>HTTP Url: </b>{{ httpBaseUrl }}

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
    ...mapGetters("config", ["httpBaseUrl"]),
  },
});
</script>
