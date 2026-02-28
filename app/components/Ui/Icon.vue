<template>
  <i
    :class="[icon, size, color, deg, { 'icon--cursor': cursor }]"
    class="icon"
  />
</template>

<script setup>
const props = defineProps({
  icon: [String, Object],
  size: String,
  color: {
    type: String,
    deflaut: "transparent",
  },
  deg: String,
  cursor: Boolean,
});
</script>

<style lang="scss" scoped>
.icon {
  &--cursor {
    cursor: pointer;
  }
}
</style>
