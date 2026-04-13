<template>
  <div class="detail-stats">
    <div
      v-for="stat in stats"
      :key="stat.key"
      class="detail-stats__item"
    >
      <p class="detail-stats__value" :class="stat.valueClass">
        {{ stat.value }}
      </p>
      <p class="detail-stats__label">
        {{ stat.label }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.detail-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: $gap-md;

  &__item {
    padding: $padding-md;
    border-radius: $border-r-md;
    background-color: $surface-100;
    box-shadow: $box-shadow;
  }

  &__value {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;

    &.is-success {
      color: $green-500;
    }

    &.is-danger {
      color: $red-300;
    }

    &.is-accent {
      color: $secondary-accent;
    }
  }

  &__label {
    color: $surface-400;
    margin-top: 6px;
  }
}

@media (max-width: 900px) {
  .detail-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .detail-stats {
    grid-template-columns: 1fr;
  }
}
</style>
