<template>
  <div>
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

const codeReader = new BrowserQRCodeReader();

export default defineComponent({
  name: "ScanCell",
  data() {
    return {
      capturing: true,
    }
  },
  props: {
    separator: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  async mounted() {
    const decoded = await codeReader.decodeOnceFromVideoDevice(undefined, "video");
    console.log(decoded.getText());
    
    const elem = document.getElementById("video") as any;
    const stream = elem.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function(track: MediaStreamTrack) {
      track.stop();
    });

    elem.srcObject = null;
    this.capturing = false;
  }
});
</script>
