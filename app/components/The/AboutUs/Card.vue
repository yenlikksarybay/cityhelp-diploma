<template>
  <div class="card">
    <div class="card__wrapper" :class="card.bgColor">
      <p class="card__number" :style="{ color: card.color }">
        {{ card.number }}
      </p>
      <p class="card__name" :style="{ color: card.color }">{{ card.name }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  card: Object,
});
</script>

<style lang="scss" scoped>
.card {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    padding: $padding-md;
    box-shadow: $box-shadow;
    border-radius: $border-r-md;
    text-align: center;
  }
  &__name {
    font-weight: 500;
  }
  &__number {
    font-size: 26px;
    font-weight: 600;
  }
}
</style>
