<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="mdi-menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          jCharge
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menu
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from "components/EssentialLink.vue";
import { mapGetters } from "vuex";

const linksData = [
  {
    title: "Dashboard",
    caption: "Main jCharge dashboard",
    icon: "mdi-view-dashboard",
    to: { name: "dashboard" },
  },
  {
    title: "Cell Database",
    caption: "Your cell database",
    icon: "mdi-battery",
    to: { name: "cellDatabase" },
  },
  {
    title: "jCharge on Github",
    caption: "github.com/jabelone/jCharge",
    icon: "mdi-github",
    link: "https://github.com/jabelone/jCharge",
  },
];

import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  name: "MainLayout",
  components: { EssentialLink },
  setup() {
    const leftDrawerOpen = ref(false);
    const essentialLinks = ref(linksData);

    return { leftDrawerOpen, essentialLinks };
  },
  computed: {
    ...mapGetters("devices", ["getDevices"]),
  },
});
</script>
