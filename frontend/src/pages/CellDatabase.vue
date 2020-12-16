<template>
  <q-page class="row items-center justify-evenly">
    <q-table
      title="Cells"
      :data="cells"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :grid="gridMode"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { date } from "quasar";
import { ICell, ICellType } from "../../../backend/src/models/Cell";

export default defineComponent({
  name: "CellDatabase",
  data() {
    return {
      filter: "",
      columns: [
        {
          name: "id", align: "center", label: "Cell ID", field: "id", sortable: true,
        },
        {
          name: "type",
          label: "Type",
          field: "cellType",
          sortable: true,
          format: (val: ICellType) => val.name,
        },
        {
          name: "class", label: "Class", field: "class", sortable: true,
        },
        {
          name: "state", label: "State", field: "state", sortable: true,
        },
        {
          name: "created", label: "Created Date", field: "created", format: (val: number) => date.formatDate(val, "DD/MM/YY"),
        },
      ],
      cells: [] as Array<ICell>,
    };
  },
  beforeMount() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.$axios.get("/api/cells/").then((result) => {
      this.cells = result.data as Array<ICell>;
    });
  },
  computed: {
    gridMode() {
      return this.$q.screen.lt.sm;
    },
  },
});
</script>
