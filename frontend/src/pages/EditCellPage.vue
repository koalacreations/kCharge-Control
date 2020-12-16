<template>
  <q-page class="row items-center justify-evenly">
    <edit-cell :cellId="cellId" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import EditCell from "src/components/EditCell.vue";

export default defineComponent({
  components: { EditCell },
  name: "EditCellPage",
  computed: {
    cellId() {
      return this.$route.params.cellId
    }
  }
});
</script>
