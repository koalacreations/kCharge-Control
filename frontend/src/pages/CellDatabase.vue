<template>
  <q-page class="row items-center justify-evenly">
    <q-table
      title="Cells"
      :data="cells"
      :columns="columns"
      row-key="id"
      :filter="filter"
      hide-header
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

interface ICell {
        id: number,
        type: string,
        state: string,
        created: number,
      }

export default defineComponent({
  name: "Dashboard",
  data() {
    return {
      filter: "",
      columns: [
        {
          name: "id", align: "center", label: "Cell ID", field: "id", sortable: true,
        },
        {
          name: "type", label: "Brand and Type", field: "type", sortable: true,
        },
        {
          name: "state", label: "State", field: "state", sortable: true,
        },
        { name: "created", label: "Created Date", field: "created" },
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
});
</script>
