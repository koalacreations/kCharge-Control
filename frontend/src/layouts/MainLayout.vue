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
            :icon="icons.back"
            aria-label="Back"
            @click="goBack()"
          />
        </template>
        <template v-else>
          <q-btn
            flat
            dense
            round
            :icon="icons.menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        </template>

        <div class="text-h5">
          {{ title }}
        </div>

        <q-space />

        <span>Continuous:</span>
        <q-toggle
          color="accent"
          round
          flat
          v-model="continuousMode"
          :disable="!sioConnected"
        >
          <q-tooltip :delay="200">
            Enable continous scanning mode (ie for bulk processing cells).
          </q-tooltip>
        </q-toggle>

        <q-btn
          v-if="!scanning && barcodeEnable"
          round
          flat
          :icon="icons.scanQr"
          @click="startScan()"
          :disable="!sioConnected"
        >
          <q-tooltip :delay="200">
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
            Sorry, barcode scanning isn't supported on this device. Try the
            mobile app.
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      id="main-drawer"
    >
      <q-list id="main-drawer-list">
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

    <transition-group
      enter-active-class="animated fadeIn"
      v-if="sioConnected"
    >
      <q-page-container
        id="main-container"
        key="main-container"
        class="q-mx-md"
      >
        <router-view />
      </q-page-container>
    </transition-group>
    <transition-group
      enter-active-class="animated fadeIn"
      v-else
    >
      <q-page-container
        class="q-pa-md text-center"
        key="searching-container"
      >
        <q-spinner-rings
          color="primary"
          size="10em"
          class="q-my-md"
        />
        <p class="q-pt-md">
          Searching for a jCharge server
          <span class="one">.</span><span class="two">.</span><span class="three">.</span>
        </p>
      </q-page-container>
    </transition-group>
  </q-layout>
</template>

<script lang="ts" >
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import EssentialLink from "components/EssentialLink.vue";
import CrossHair from "components/CrossHair.vue";
import { defineComponent, ref } from "@vue/composition-api";
import { mapGetters } from "vuex";
import { Plugins } from "@capacitor/core";
import { AxiosError } from "axios";
import barcode from "../mixins/barcode";
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { ICell } from "../../../backend/src/models/Cell";
import { EventBus } from "../event-bus";
import icons from "../icons";

const BS = Plugins.BarcodeScanner;

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
    title: "Settings",
    caption: "Configure jCharge settings",
    icon: "mdi-cog",
    to: { name: "settings" },
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
  mixins: [barcode],
  data() {
    return {
      continuousMode: false,
      scanning: false,
      cellType: "",
      cellId: 0,
      retrieved: {} as ICell,
      title: "jCharge",
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
    ...mapGetters("config", ["sioConnected"]),
    icons() {
      return icons;
    },
  },
  watch:{
    $route (){
        this.stopScan();
    }
  },
  mounted() {
    EventBus.$on("cell-updated", () => {
      if (this.continuousMode) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.startScan();
      }
    });

    EventBus.$on("scan-start", (slotId: {slotId: string}) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.startScan(true, slotId.slotId);
    });

    EventBus.$on("title-update", (title: string) => {
        this.title = title;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.stopScan();
    next();
  },
  methods: {
    async goBack() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (this.$route.meta.backRoute) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        await this.$router.push({name: this.$route.meta.backRoute});
      } else {
        this.$router.go(-1);
      }
    },
    stopScan() {
      const container = document.getElementById("main-container");
      const body = document.getElementById("main-body");
      if (container) container.classList.remove("hide");
      if (body) body.classList.remove("transparentbg");
      this.scanning = false;

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        BS.showBackground().catch(null);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        BS.stopScan().catch(null);
        EventBus.$emit("scan-stop");
      }
      catch {
        // do nothing
      }
    },
    async retrieveCell() {
      const retrieved = await this.$axios.get(`/api/cells/${this.cellId}/`);
      const data = retrieved.data as ICell;
      this.retrieved = data;
    },
    async startScan(external=false, slotId="") {
      this.leftDrawerOpen = false;
      this.scanning = true;
      let decoded = null;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
      const status = await BS.checkPermission({ force: true });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!status.granted) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
      BS.hideBackground().catch(() => {});
      const container = document.getElementById("main-container");
      const body = document.getElementById("main-body");
      if (body) body.classList.add("transparentbg");
      if (container) container.classList.add("hide");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
      const result = await BS.startScan() as {content: string};

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
            message: "Malformed Barcode",
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
      this.cellId = parseInt(cellId);
      this.cellType = cellType;

      if (external) {
        // if we're an external scan then we want to stop scanning and emit the scan result to the event bus
        this.stopScan();
        EventBus.$emit(`scan-result-${slotId}`, {cellId, cellType});

      } else {
        const response = await this.$axios
        .post("/api/cells/", { type: cellType, id: cellId })
        .catch(async (error) => {
          const cellResponse = (error as AxiosError).response;

          if (cellResponse?.status === 409) {
            await this.retrieveCell();

            this.$q.notify({
              color: "green-4",
              textColor: "white",
              icon: "mdi-battery",
              message: `Found existing ${this.retrieved.cellType.name}`,
              timeout: 2000,
            });
            this.viewCell(cellId);
          }
        });

        if (response && response.status === 201) {
          const cell = response?.data as ICell;
          this.retrieved = cell;

          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "mdi-new-box",
            message: `Added a new ${cell.cellType.name}`,
            timeout: this.continuousMode ? 2000 : 1000,
          });

          if (this.continuousMode) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                setTimeout(() => {this.startScan();}, 1000);
          } else {
            this.viewCell(cellId);
          }
        }
      }
    },
    async restartScan() {
      this.scanning = true;
      this.cellType = "";
      this.cellId = 0;
      this.retrieved = {} as ICell;
      await this.startScan();
    },
    viewCell(cellId: string) {
      this.$router.push({ name: "editCell", params: { cellId } }).catch(null);
    },
  },
});
</script>

<style lang="scss">
#main-layout {
 padding-left: env(safe-area-inset-left);
 padding-right: env(safe-area-inset-right);
}

#main-drawer-list {
 padding-left: env(safe-area-inset-left);
 padding-bottom: env(safe-area-inset-bottom);
}

.one {
  opacity: 0;
  -webkit-animation: dot 1.3s infinite;
  -webkit-animation-delay: 0s;
  animation: dot 1.3s infinite;
  animation-delay: 0s;
}

.two {
  opacity: 0;
  -webkit-animation: dot 1.3s infinite;
  -webkit-animation-delay: 0.2s;
  animation: dot 1.3s infinite;
  animation-delay: 0.2s;
}

.three {
  opacity: 0;
  -webkit-animation: dot 1.3s infinite;
  -webkit-animation-delay: 0.3s;
  animation: dot 1.3s infinite;
  animation-delay: 0.3s;
}

@-webkit-keyframes dot {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes dot {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
