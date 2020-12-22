<template>
  <q-layout
    view="lHh Lpr lFf"
    id="main-layout"
  >
    <q-dialog
      ref="addCellDialog"
      v-model="scanning"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        style="width: 100%; border-radius: 0; background-color: transparent; border: solid 3px;"
      >
        <q-card-section class="bg-white row">
          <div class="text-black text-h6">
            Scan a QR code
          </div>

          <q-space />

          <q-btn
            color="black"
            flat
            icon="mdi-close"
            @click="stopScan()"
            v-close-popup
          />
        </q-card-section>

        <q-card-section
          class="q-pt-none"
          style="height: 250px; background-color: transparent;"
        />
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
          icon="mdi-camera"
          @click="startScan()"
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
import { mapGetters } from "vuex";
// import { BrowserQRCodeReader } from "@zxing/library";
import { Plugins } from "@capacitor/core";
import { AxiosError } from "axios";
import { BarcodeScanner } from "@dutchconcepts/capacitor-barcode-scanner";
import { ICell } from "../../../backend/src/models/Cell";

const BS = Plugins.BarcodeScanner;
// const codeReader = new BrowserQRCodeReader();

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
  components: { EssentialLink },
  setup() {
    const leftDrawerOpen = ref(false);
    const essentialLinks = ref(linksData);

    return { leftDrawerOpen, essentialLinks };
  },
  computed: {
    ...mapGetters("devices", ["getDevices"])
  },
  methods: {
    stopScan() {
      const body = document.getElementById("main-body");
      const layout = document.getElementById("main-layout");
      if (layout) layout.classList.remove("hide");
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
        // the user granted permission
        return;
      }
      // const qrCode = await codeReader.decodeOnceFromVideoDevice(undefined, "video");
      BS.hideBackground().catch(() => {});
      const body = document.getElementById("main-body");
      const layout = document.getElementById("main-layout");
      if (layout) layout.classList.add("hide");
      if (body) body.classList.add("transparentbg");

      const result = await BS.startScan(); // start scanning and wait for a result

      if (body) body.classList.remove("transparentbg");
      if (layout) layout.classList.remove("hide");

      try {
        if (result.content) decoded = result.content.split(",");
        this.stopScan();

        if (decoded?.length !== 2) {
          this.$q.notify({
            color: "red-4",
            textColor: "white",
            icon: "mdi-alert-circle",
            message: "Malformed QR Code"
          });
          return;
        }
      } catch (error) {
        this.capturing = false;
        this.loading = false;
        this.errorCamera = true;
        this.cellType = "";
        this.cellId = 0;
        return;
      }

      // eslint-disable-next-line prefer-destructuring
      const cellType = decoded[0];
      const cellId = decoded[1];

      this.loading = true;
      const response = await this.$axios.post("/api/cells/", { type: cellType, id: cellId })
        .catch((error) => {
          const cellResponse = (error as AxiosError).response;
          if (cellResponse?.status === 409) {
            this.retrieved.cellId = this.cellId;
            this.viewCell(cellId);
          } else {
            this.error = true;
          }
        })
        .finally(() => { this.loading = false; });

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
      this.capturing = true;
      this.loading = false;
      this.error = false;
      this.errorCamera = false;
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
