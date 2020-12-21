<template>
  <div>
    <div class="q-mb-sm">
      Add or find a cell by scanning it's QR Code.
    </div>

    <div
      id="cell-status"
      class="q-my-sm"
      v-if="error"
    >
      <h6 class="q-my-none">
        There was an error adding or finding this cell.
      </h6>
    </div>

    <q-banner
      rounded
      v-if="retrieved.cellId"
      class="q-my-sm"
      :class="{'bg-primary': exists, 'bg-green-4': createdNew}"
    >
      <div
        class="text-h6"
        v-if="createdNew"
      >
        Added New Cell
      </div>
      <div
        class="text-h6"
        v-else
      >
        Found Existing Cell
      </div>
      <div>Type: {{ retrieved.cellType }}</div>
      <div>ID: {{ retrieved.cellId }}</div>
    </q-banner>

    <div
      id="cell-status"
      class="q-pt-md"
      v-if="loading"
    >
      <div class="text-h6">
        Processing...
      </div>
      <div class="row justify-center">
        <q-circular-progress
          indeterminate
          size="50px"
          :thickness="0.22"
          color="primary"
          track-color="grey-3"
          class="q-ma-md"
        />
      </div>
    </div>

    <q-btn
      v-if="exists || createdNew || error"
      color="primary"
      class="q-mr-sm"
      label="New Scan"
      @click="restartScan()"
    />
    <q-btn
      v-if="exists || createdNew"
      color="primary"
      label="View Cell"
      @click="viewCell()"
      v-close-popup
    />

    <video
      v-if="capturing"
      style="width:100%;"
      id="video"
    />
  </div>
</template>

<script lang="ts" >
import { defineComponent } from "@vue/composition-api";
import { BrowserQRCodeReader } from "@zxing/library";
import { AxiosError } from "axios";
import { ICell } from "../../../backend/src/models/Cell";

const codeReader = new BrowserQRCodeReader();

export default defineComponent({
  name: "ScanCell",
  data() {
    return {
      capturing: true,
      loading: false,
      exists: false,
      error: false,
      createdNew: false,
      cellType: "",
      cellId: 0,
      retrieved: {
        cellType: "",
        cellId: 0,
      },
    };
  },
  props: {
    separator: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  async mounted() {
    await this.startScan();
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
    },
    async retrieveCell() {
      const retrieved = await this.$axios.get(`/api/cells/${this.cellId}/`);
      const data = retrieved.data as ICell;
      this.retrieved.cellType = data.cellType.name;
      this.retrieved.cellId = data.id;
    },
    async startScan() {
      const qrCode = await codeReader.decodeOnceFromVideoDevice(undefined, "video");
      const decoded = qrCode.getText().split(",");
      this.stopVideo();

      // eslint-disable-next-line prefer-destructuring
      this.cellType = decoded[0];
      this.cellId = parseInt(decoded[1]);

      this.loading = true;
      const response = await this.$axios.post("/api/cells/", { type: this.cellType, id: this.cellId })
        .catch(async (error) => {
          this.exists = true;

          if ((error as AxiosError).response?.status === 409) {
            await this.retrieveCell();
            this.cellType = "";
            this.cellId = 0;
          }
        })
        .finally(() => { this.loading = false; });

      if (response && response.status === 201) {
        const data = response.data as ICell;
        this.retrieved.cellType = data.cellType.name;
        this.retrieved.cellId = data.id;
        this.cellType = "";
        this.cellId = 0;
        this.createdNew = true;
        this.loading = false;
      }
    },
    async restartScan() {
      this.capturing = true;
      this.loading = false;
      this.createdNew = false;
      this.error = false;
      this.exists = false;
      this.cellType = "";
      this.cellId = 0;
      this.retrieved = {
        cellType: "",
        cellId: 0,
      };
      await this.startScan();
    },
    viewCell() {
      this.$router.push({ name: "editCell", params: { cellId: String(this.retrieved.cellId) } }).catch(() => {});
    },
  },
});
</script>
