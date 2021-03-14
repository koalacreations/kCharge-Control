<template>
  <div
    class="cell-container"
    @click="cellClicked"
  >
    <div
      class="cell column items-center q-py-sm q-px-xs"
    >
      <div class="row q-pb-sm">
        <q-btn
          class="col q-mr-xs"
          round
          color="primary"
          size="0.85em"
          :icon="icons.scanQr"
        />
        <q-btn
          class="col"
          round
          color="primary"
          size="0.85em"
          :icon="icons.info"
        />
      </div>

      <div class="status">
        <div>{{ status }}</div>
        <div>{{ voltage.toFixed(2) }} V</div>
        <div>{{ capacity }} mAh</div>
      </div>

      <div class="title">
        {{ cell }}
      </div>

      <div
        class="status-led q-my-sm"
        :class="activeClass"
      />
    </div>
  </div>
</template>

<script lang="ts" >
import { defineComponent } from "@vue/composition-api";
import { EventBus } from "../event-bus";
import icons from "../icons";

export default defineComponent({
  name: "Cell",
  props: {
    deviceId: {
      required: true,
      type: String
    },
    status: {
      type: String,
      default: "empty"
    },
    cell: {
      required: false,
      type: Number
    },
    voltage: {
      default: "-",
    },
    capacity: {
      default: "-",
    },
  },
  data() {
    return {
      activeClass: "",
      interval: 0 as unknown as ReturnType<typeof setInterval>,
      scanHandler: 0 as unknown as ReturnType<typeof EventBus.$on>,
    };
  },
  computed: {
    icons() {
      return icons;
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.interval = setInterval(() => {
      if (this.status === "charging" || this.status === "discharging")
        this.activeClass = this.activeClass ? "" : "yellow";
      else this.activeClass = "";
    }, 1000);

    // this.scanHandler = EventBus.$on(`scan-result-${this.deviceId}-${this.cell}`, (result: {cellId: string, cellType: string}) => {
    //     console.log("Scan result! ", result);
    // });
  },
  methods: {
    cellClicked() {
      EventBus.$emit("scan-start", {slotId: `${this.deviceId}-${this.cell || ""}`});
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
</style>
