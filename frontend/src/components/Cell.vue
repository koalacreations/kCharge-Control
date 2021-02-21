<template>
  <div class="cell-container">
    <div
      class="cell column items-center q-py-md q-px-sm"
    >
      <div class="title">
        {{ cell }}
        <div>{{ status }}</div>
      </div>

      <div
        class="status-led q-my-sm"
        :class="activeClass"
      />

      <div class="status">
        <div>{{ voltage }} V</div>
        <div>{{ capacity }} mAh</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "Cell",
  props: {
    cell: Number,
    voltage: {
      default: "?",
    },
    capacity: {
      default: "?",
    },
  },
  data() {
    return {
      activeClass: "",
      status: "Unknown",
    };
  },
  mounted() {
    setInterval(() => {
      if (this.status === "charging" || this.status === "discharging")
        this.activeClass = this.activeClass ? "" : "yellow";
      else this.activeClass = "";
    }, 1000);
  },
});
</script>

<style lang="scss" scoped>
.cell-container {
  min-width: 80px;
}

.title {
  text-align: center;
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
