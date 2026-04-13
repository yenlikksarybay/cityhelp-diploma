<template>
  <div class="detail-info">
    <div
      v-for="item in items"
      :key="item.key"
      class="detail-info__item"
    >
      <p class="detail-info__key">
        {{ item.label }}
      </p>
      <p class="detail-info__value">
        {{ item.value || "—" }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.detail-info {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: $gap-md;

  &__item {
    padding: $padding-md;
    border-radius: $border-r-md;
    background-color: $surface-100;
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__key {
    color: $surface-400;
    font-size: 13px;
  }

  &__value {
    font-weight: 700;
  }
}

@media (max-width: 900px) {
  .detail-info {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .detail-info {
    grid-template-columns: 1fr;
  }
}
</style>
