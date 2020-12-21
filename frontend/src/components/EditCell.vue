<template>
  <div>
    <h5>
      Edit this cell
    </h5>

    <q-form
      @submit="onSubmit"
      v-if="cell.cellType"
      class="q-gutter-y-md column"
    >
      <div class="row q-col-gutter-x-md">
        <div class="col-xs-4 col-md-3">
          <q-input
            outlined
            v-model="cell.id"
            disable
            label="ID"
          />
        </div>
        <div class="col">
          <q-input
            outlined
            v-model="cell.cellType.name"
            disable
            label="Type"
          />
        </div>
      </div>

      <q-select
        outlined
        v-model="cellState"
        :options="options"
        label="State"
      >
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
          >
            <q-item-section avatar>
              <q-icon :name="scope.opt.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
              <q-item-label caption>
                {{ scope.opt.description }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-checkbox
        v-model="cell.class"
        color="secondary"
        label="Is this a heater cell?"
        true-value="heater"
        false-value="normal"
      />

      <div>
        <q-btn
          label="Submit"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>

    <div
      id="cell-status"
      class="q-my-sm"
      v-if="error"
    >
      <h6 class="q-my-none">
        There was an error editing this cell.
      </h6>
    </div>
  </div>
</template>

<script lang="ts" >
import { defineComponent } from "@vue/composition-api";
import { QSelect } from "quasar";
import { ICell } from "../../../backend/src/models/Cell";

export default defineComponent({
  name: "EditCell",
  data() {
    return {
      cellState: {},
      cell: {} as ICell,
      error: false,
      options: [
        {
          label: "Charged",
          value: "charged",
          description: "Fully charged cell",
          icon: "mdi-battery-high",
        },
        {
          label: "Storage",
          value: "storage",
          description: "Cell at storage voltage",
          icon: "mdi-battery-medium",
        },
        {
          label: "Discharged",
          value: "discharged",
          description: "Fully discharged cell",
          icon: "mdi-battery-low",
        },
        {
          label: "Charging",
          value: "charging",
          description: "Currently charging",
          icon: "mdi-battery-charging-high",
        },
        {
          label: "Discharging",
          value: "discharging",
          description: "Currently discharging",
          icon: "mdi-battery-charging-low",
        },
        {
          label: "New",
          value: "new",
          description: "Newly added cell",
          icon: "mdi-new-box",
        },
      ],
    };
  },
  props: {
    cellId: {
      type: [String, Number],
      required: true,
    },
  },
  async mounted() {
    await this.retrieveCell();
  },
  watch: {
    cellState() {
      this.cell.state = (this.cellState as QSelect).value as string;
    },
  },
  methods: {
    async retrieveCell() {
      const retrieved = await this.$axios.get(`/api/cells/${this.cellId}/`);
      const data = retrieved.data as ICell;
      this.cell = data;

      const state = this.options.find((option) => option.value === data.state);
      if (state) this.cellState = state;
      else {
        this.cellState = {
          label: "Unknown",
          value: "unknown",
          description: "Unknown state from database",
          icon: "mdi-help",
        };
      }
    },
    onSubmit() {
      this.$axios.put(`/api/cells/${this.cellId}/`, this.cell).then(() => {
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "mdi-check",
          message: "Saved",
        });
      }).catch(() => {
        this.$q.notify({
          color: "red-4",
          textColor: "white",
          icon: "mdi-alert-circle",
          message: "Error",
        });
      });
    },
  },
});
</script>
