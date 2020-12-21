<template>
  <q-page class="row items-center justify-evenly">
    <edit-cell
      class="edit-cell"
      :cell-id="cellId"
    />
  </q-page>
</template>

<script lang="ts" >
import { defineComponent } from "@vue/composition-api";
import EditCell from "src/components/EditCell.vue";

export default defineComponent({
  components: { EditCell },
  name: "EditCellPage",
  computed: {
    cellId() {
      return this.$route.params.cellId;
    },
  },
});
</script>

<style lang="scss" scoped>
.edit-cell {
  width: 50%;
  max-width: 500px;
}

@media (max-width: $breakpoint-xs-max) {
  .edit-cell {
    width: 80%;
    max-width: 500px;
  }
}
</style>
