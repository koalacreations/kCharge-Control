<template>
<span>
  <q-separator v-if="separator" />
  <q-item
    v-else-if="link"
    clickable
    tag="a"
    target="_blank"
    :href="link"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item
    v-else
    clickable
    tag="a"
    :to="to"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "EssentialLink",
  props: {
    separator: {
      type: Boolean,
      required: false,
      default: false,
    },

    title: {
      type: String,
      required: false,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: null,
    },

    to: {
      type: Object,
      default: null,
    },

    icon: {
      type: String,
      default: "",
    },
  },
});
</script>
