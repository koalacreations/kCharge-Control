<template>
  <q-layout
    view="lHh Lpr lFf"
    id="main-layout"
  >
    <q-header elevated>
      <q-toolbar>
        <template v-if="$route.meta.backButton">
          <q-btn
            flat
            dense
            round
            icon="mdi-arrow-left"
            aria-label="Back"
            @click="$router.go(-1)"
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
          v-if="!scanning && barcodeEnable"
          round
          flat
          icon="mdi-camera"
          @click="startScan()"
        >
          <q-tooltip :delay="500">
            Add or find a cell
          </q-tooltip>
        </q-btn>

        <q-btn
          v-else-if="barcodeEnable"
          flat
          icon="mdi-close"
          @click="stopScan()"
          v-close-popup
        />

        <q-btn
          v-else
          round
          flat
          icon="mdi-camera"
          disable
        >
          <q-tooltip :delay="500">
            Sorry, barcode scanning isn't supported on this device. Try the mobile app.
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

    <div
      v-if="scanning"
      class="column items-center justify-center q-pa-xl"
      style="height: 100vh;"
    >
      <cross-hair />
    </div>

    <q-page-container
      id="main-container"
      class="q-mx-md"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" >
import EssentialLink from "components/EssentialLink.vue";
import CrossHair from "components/CrossHair.vue";
import { defineComponent, ref } from "@vue/composition-api";
import { mapGetters } from "vuex";
import { Plugins } from "@capacitor/core";
import { AxiosError } from "axios";
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { BarcodeScannerPlugin } from "@dutchconcepts/capacitor-barcode-scanner";
import { ICell } from "../../../backend/src/models/Cell";

const BS = Plugins.BarcodeScanner;

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
      scanning: false,
      cellType: "",
      cellId: 0,
      retrieved: {
        cellType: "",
        cellId: 0
      }
    };
  },
  components: { EssentialLink, CrossHair },
  setup() {
    const leftDrawerOpen = ref(false);
    const essentialLinks = ref(linksData);

    return { leftDrawerOpen, essentialLinks };
  },
  computed: {
    ...mapGetters("devices", ["devices"]),
    barcodeEnable() : boolean {
      return (this.$q.platform.is.ios as boolean || this.$q.platform.is.android as boolean)
      || false;
    }
  },
  methods: {
    stopScan() {
      const container = document.getElementById("main-container");
      const body = document.getElementById("main-body");
      if (container) container.classList.remove("hide");
      if (body) body.classList.remove("transparentbg");
      this.scanning = false;

      BS.showBackground().catch(null);
      BS.stopScan().catch(null);
    },
    async retrieveCell() {
      const retrieved = await this.$axios.get(`/api/cells/${this.cellId}/`);
      const data = retrieved.data as ICell;
      this.retrieved.cellType = data.cellType.name;
      this.retrieved.cellId = data.id;
    },
    async startScan() {
      this.scanning = true;
      let decoded = null;
      const status = await BS.checkPermission({ force: true });

      if (!status.granted) {
        return;
      }

      BS.hideBackground().catch(() => {});
      const container = document.getElementById("main-container");
      const body = document.getElementById("main-body");
      if (body) body.classList.add("transparentbg");
      if (container) container.classList.add("hide");

      const result = await BS.startScan();

      if (container) container.classList.remove("hide");
      if (body) body.classList.remove("transparentbg");

      try {
        if (result.content) decoded = result.content.split(",");
        this.stopScan();

        if (decoded?.length !== 2) {
          this.$q.notify({
            color: "red-4",
            textColor: "white",
            icon: "mdi-alert-circle",
            message: "Malformed Barcode"
          });
          return;
        }
      } catch (error) {
        this.scanning = false;
        this.cellType = "";
        this.cellId = 0;
        return;
      }

      // eslint-disable-next-line prefer-destructuring
      const cellType = decoded[0];
      const cellId = decoded[1];

      const response = await this.$axios.post("/api/cells/", { type: cellType, id: cellId })
        .catch((error) => {
          const cellResponse = (error as AxiosError).response;
          if (cellResponse?.status === 409) {
            this.retrieved.cellId = this.cellId;
            this.viewCell(cellId);
          }
        });

      if (response && response.status === 201) {
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "mdi-new-box",
          message: "New cell found"
        });

        this.retrieved.cellId = this.cellId;
        this.viewCell(cellId);
      }
    },
    async restartScan() {
      this.scanning = true;
      this.cellType = "";
      this.cellId = 0;
      this.retrieved = {
        cellType: "",
        cellId: 0
      };
      await this.startScan();
    },
    viewCell(cellId: string) {
      this.$router.push({ name: "editCell", params: { cellId } }).catch(null);
    }
  }
});
</script>
