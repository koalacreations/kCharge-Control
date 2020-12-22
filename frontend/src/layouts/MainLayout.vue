<template>
  <q-layout view="lHh Lpr lFf">
    <q-dialog
      ref="addCellDialog"
      v-model="newCellDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="max-width: 350px">
        <q-card-section>
          <div class="text-h6">
            Search for or add a cell
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <scan-cell @finished="newCellDialog = false" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            @click="stopVideo()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-header elevated>
      <q-toolbar>
        <template v-if="true">
          <q-btn
            flat
            dense
            round
            icon="mdi-menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        </template>

        <template v-else>
          <q-btn
            flat
            dense
            round
            icon="mdi-menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        </template>

        <q-toolbar-title>
          jCharge
        </q-toolbar-title>

        <q-space />

        <q-btn
          round
          flat
          icon="mdi-battery"
          @click="newCellDialog = true"
        >
          <q-tooltip :delay="500">
            Add or find a cell
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
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

<script lang="ts" >
import EssentialLink from "components/EssentialLink.vue";
import { defineComponent, ref } from "@vue/composition-api";
import ScanCell from "components/ScanCell.vue";
import { mapGetters } from "vuex";

const linksData = [
  {
    title: "Dashboard",
    caption: "Main jCharge dashboard",
    icon: "mdi-view-dashboard",
    to: { name: "dashboard" }
  },
  {
    title: "Cell Database",
    caption: "Your cell database",
    icon: "mdi-battery",
    to: { name: "cellDatabase" }
  },

  {
    separator: true
  },

  {
    title: "jCharge on Github",
    caption: "github.com/jabelone/jCharge",
    icon: "mdi-github",
    link: "https://github.com/jabelone/jCharge"
  }
];

export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      newCellDialog: false
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
    ...mapGetters("devices", ["getDevices"])
  },
  methods: {
    stopVideo() {
      const elem = document.getElementById("video") as HTMLVideoElement;
      const stream = elem.srcObject;
      const tracks = (stream as MediaStream).getTracks();

      tracks.forEach((track: MediaStreamTrack) => {
        track.stop();
      });

      elem.srcObject = null;
      this.capturing = false;
    }
  }
});
</script>
