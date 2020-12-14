<template>
  <q-layout view="lHh Lpr lFf">
    <q-dialog ref="addCellDialog" v-model="newCellDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="max-width: 350px">
        <q-card-section>
          <div class="text-h6">Add new cell</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Add a new battery cell by scanning it's QR Code.
        </q-card-section>

         <q-card-section class="q-pt-none">
          <scan-cell/>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

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

        <q-space/>

        <q-btn round flat icon="mdi-battery-unknown">
          <q-tooltip :delay="500">
            Search for battery cell
          </q-tooltip>
        </q-btn>
        <q-btn round flat icon="mdi-battery-positive" @click="newCellDialog = true">
          <q-tooltip :delay="500">
            Add a new battery cell
          </q-tooltip>
        </q-btn>
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
import { defineComponent, ref } from "@vue/composition-api";
import ScanCell from "components/ScanCell.vue";
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
    separator: true,
  },

  {
    title: "jCharge on Github",
    caption: "github.com/jabelone/jCharge",
    icon: "mdi-github",
    link: "https://github.com/jabelone/jCharge",
  },
];

export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      newCellDialog: false,
    };
  },
  beforeMount() {
    if (this.$route.path.includes("newCellDialog")) this.newCellDialog = true;
  },
  beforeRouteUpdate(to) {
    if (to.path.includes("newCellDialog")) this.newCellDialog = true;
  },
  components: { EssentialLink, ScanCell },
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
