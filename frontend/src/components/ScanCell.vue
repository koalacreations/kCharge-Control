<template>
  <div>
    <div class="q-mb-sm">
      Search for a cell (or add a new one) by scanning it's QR Code.
    </div>

    <q-banner
      rounded
      v-if="error"
      class="q-my-sm bg-red-4"
    >
      There was an error searching for or adding this cell.
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
      error: false,
      cellType: "",
      cellId: 0,
      retrieved: {
        cellType: "",
        cellId: 0
      }
    };
  },
  props: {
    separator: {
      type: Boolean,
      required: false,
      default: false
    }
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
      let decoded = null;
      try {
        const qrCode = await codeReader.decodeOnceFromVideoDevice(undefined, "video");
        decoded = qrCode.getText().split(",");
        this.stopVideo();
      } catch (error) {
        this.capturing = false;
        this.loading = false;
        this.error = true;
        this.cellType = "";
        this.cellId = 0;
        return;
      }

      // eslint-disable-next-line prefer-destructuring
      this.cellType = decoded[0];
      this.cellId = parseInt(decoded[1]);

      this.loading = true;
      const response = await this.$axios.post("/api/cells/", { type: this.cellType, id: this.cellId })
        .catch((error) => {
          const cellResponse = (error as AxiosError).response;
          if (cellResponse?.status === 409) {
            this.retrieved.cellId = this.cellId;
            this.viewCell();
          } else {
            this.error = true;
          }
        })
        .finally(() => { this.loading = false; });

      if (response && response.status === 201) {
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "mdi-check",
          message: "Added new cell!"
        });

        this.retrieved.cellId = this.cellId;
        this.viewCell();
      }
    },
    async restartScan() {
      this.capturing = true;
      this.loading = false;
      this.error = false;
      this.cellType = "";
      this.cellId = 0;
      this.retrieved = {
        cellType: "",
        cellId: 0
      };
      await this.startScan();
    },
    viewCell() {
      this.$emit("finished");
      this.$router.replace({ name: "editCell", params: { cellId: String(this.retrieved.cellId) } }).catch(() => {});
    }
  }
});
</script>
