<template>
  <div>
    <h5>
      Edit this cell
    </h5>

    <q-form @submit="onSubmit"
      class="q-gutter-md">
      <q-input outlined v-model="cell.id" disable label="Cell ID" />
      <q-input outlined v-model="cell.cellType.name" disable label="Cell Type" />
      <q-checkbox
        v-model="cell.class"
        color="secondary"
        label="Is this a heater cell?"
        true-value="heater"
        false-value="normal"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>

    <div id="cell-status" class="q-my-sm" v-if="error">
      <h6 class="q-my-none">
        There was an error editing this cell.
      </h6>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { BrowserQRCodeReader } from "@zxing/library";
import { AxiosError } from "axios";
import { ICell } from "../../../backend/src/models/Cell";

const codeReader = new BrowserQRCodeReader();

export default defineComponent({
  name: "EditCell",
  data() {
    return {
      cell: {},
    };
  },
  props: {
    cellId: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    await this.retrieveCell();
  },
  methods: {
    async retrieveCell() {
      const retrieved = await this.$axios.get(`/api/cells/${this.cellId}/`);
      const data = retrieved.data as ICell;
      this.cell = data;
    },
    async onSubmit() {
      await this.$axios.put(`/api/cells/${this.cellId}/`, this.cell);
      this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'mdi-check',
          message: 'Saved'
        })
    }
  },
});
</script>
