<template>
  <div
    class="cell-container"
    @click.stop="cellClicked"
  >
    <div
      class="cell column items-center q-py-sm q-px-xs"
    >
      <div class="status">
        <div>{{ status }}</div>
        <div>{{ voltage.toFixed(2) }} V</div>
        <div>{{ capacity.toFixed(2) }} mAh</div>
        <div>{{ Math.floor(current) }} mA</div>
        <div>{{ parseInt(temperature) }} °C</div>
      </div>

      <div class="title">
        {{ channel }}
      </div>

      <div
        class="status-led q-my-sm"
        :class="activeClass"
      />
    </div>

    <q-dialog
      v-model="dialog"
    >
      <q-card style="min-width: 370px;">
        <q-card-section>
          <div class="q-pb-md row">
            <div class="text-h6">
              Channel {{ channel }}
            </div>
            <q-space />
            <div>
              <q-btn
                :icon="icons.close"
                flat
                round
                dense
                v-close-popup
              />
            </div>
          </div>

          <div>
            <q-btn
              class="col q-mr-xs q-mb-sm"
              color="primary"
              :icon="icons.discharge"
              label="Discharge Cell"
              v-if="status === 'idle' || status === 'complete'"
              :disabled="!connected"
              @click="startDischarge"
            >
              <q-tooltip
                v-if="status !== 'idle'"
                :delay="500"
              >
                Unable to start a discharge unless this channel is idle.
              </q-tooltip>
            </q-btn>


            <q-btn
              class="col q-mr-xs q-mb-sm"
              color="primary"
              :icon="icons.stop"
              label="Stop Cell"
              v-else-if="status === 'charging' || status === 'discharging'"
              :disabled="!connected"
              @click="stopAction"
            />

            <q-btn
              class="col q-mr-xs q-mb-sm"
              color="primary"
              :icon="icons.scanQr"
              label="Scan Cell"
              :disable="!barcodeEnable"
            >
              <q-tooltip
                v-if="!barcodeEnable"
                :delay="500"
              >
                Barcode scanning is only supported on the iOS or Android app.
              </q-tooltip>
            </q-btn>

            <p>
              <b>Status:</b> {{ status }}<br>
              <b>Voltage:</b> {{ voltage.toFixed(2) }} V<br>
              <b>Capacity:</b> {{ capacity.toFixed(2) }} mAh<br>
              <b>Current:</b> {{ current }} mA<br>
            </p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" >
import { defineComponent } from "@vue/composition-api";
import {mapGetters} from "vuex";
import { EventBus } from "../event-bus";
import icons from "../icons";
import barcode from "../mixins/barcode";

export default defineComponent({
  name: "Cell",
  mixins: [barcode],
  props: {
    deviceId: {
      required: true,
      type: String
    },
    connected: {
      default: false,
    },
    status: {
      type: String,
      default: "empty"
    },
    channel: {
      required: true,
      type: Number
    },
    voltage: {
      default: "-",
    },
    capacity: {
      default: "0",
    },
    current: {
      default: "0",
    },
    temperature: {
      default: "0",
    },
  },
  data() {
    return {
      activeClass: "",
      interval: 0 as unknown as ReturnType<typeof setInterval>,
      scanHandler: 0 as unknown as ReturnType<typeof EventBus.$on>,
      dialog: false,
    };
  },
  computed: {
    ...mapGetters("config", ["setSioConnected"]),
    icons() {
      return icons;
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    let ledsOn = true;

    this.interval = setInterval(() => {
      if (this.status === "charging" || this.status === "discharging")
        this.activeClass = this.activeClass && !ledsOn ? "" : "yellow";
      else if (this.status === "complete")
        this.activeClass = "green";
      else if (this.status === "verror" || this.status === "error")
        this.activeClass = "red";
      else if (this.status === "empty")
        this.activeClass = "blue";
      else if (this.status === "idle")
        this.activeClass = "yellow";
      else this.activeClass = "";

      ledsOn = !ledsOn;
    }, 500);

    this.scanHandler = EventBus.$on(`scan-result-${this.deviceId}-${this.channel}`, (result: {cellId: string, cellType: string}) => {
        // console.log("Scan result! ", result);
    });
  },
  methods: {
    cellClicked() {
      this.dialog = true;
    },
    startDischarge() {
      EventBus.$emit("wsCommand", {command: "startAction", data: {deviceId: this.deviceId, channel: this.channel, action: "discharge"}});
    },
    stopAction() {
      EventBus.$emit("wsCommand", {command: "stopAction", data: {deviceId: this.deviceId, channel: this.channel}});
    },
    startScan() {
      EventBus.$emit("scan-start", {slotId: `${this.deviceId}-${this.channel || ""}`});
    }
  }
});
</script>

<style lang="scss" scoped>
.cell-container {
  min-width: 80px;
}

.title {
  text-align: center;
  font-size: 1.2em;
}

.status-led {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  border: 1px solid;
}

.cell {
  border-radius: 5px;
  background: $info;
  min-height: 100px;
}

.status {
  font-size: 0.9em;
}

.green {
  background: $positive;
}

.yellow {
  background: $warning;
}

.red {
  background: $negative;
}

.blue {
  background: $secondary;
}
</style>
