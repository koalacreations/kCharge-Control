<template>
  <div>
    <div class="q-mb-sm">
      Add a new battery cell by scanning it's QR Code.
    </div>
    <q-banner rounded v-if="cellId" class="bg-grey-3">
      <div class="text-h6">Scanned Cell</div>
      <div>Type: {{cellType}}</div>
      <div>ID: {{cellId}}</div>
    </q-banner>

    <div id="cell-status" class="q-pt-md" v-if="loading">
      <div class="text-h6">
        Adding cell to database...
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

    <div id="cell-exists" class="q-pt-md" v-if="exists">
      <div class="text-h6">
        Cell already exists in database!
      </div>
      <q-btn color="primary" label="Restart" @click="restartScan()" />
    </div>

    <video
      v-if="capturing"
      style="width:100%;"
      id="video"
    ></video>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { BrowserQRCodeReader } from "@zxing/library";
import { AxiosError } from "axios";

const codeReader = new BrowserQRCodeReader();

export default defineComponent({
  name: "ScanCell",
  data() {
    return {
      capturing: true,
      loading: false,
      exists: false,
      cellType: "",
      cellId: null as number | null,
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
    async startScan() {
      const qrCode = await codeReader.decodeOnceFromVideoDevice(undefined, "video");
      const decoded = qrCode.getText().split(",");
      this.stopVideo();

      // eslint-disable-next-line prefer-destructuring
      this.cellType = decoded[0];
      this.cellId = parseInt(decoded[1]);

      this.loading = true;
      const response = await this.$axios.post("/api/cells/", { type: this.cellType, id: this.cellId })
        .catch((error) => {
          if ((error as AxiosError).response?.status === 409) {
            this.exists = true;
            this.loading = false;
          }
        });
    },
    async restartScan() {
      this.capturing = true;
      this.loading = false;
      this.exists = false;
      this.cellType = "";
      this.cellId = null;
      await this.startScan();
    },
  },
});
</script>
