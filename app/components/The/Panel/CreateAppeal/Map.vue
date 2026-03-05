<template>
  <section class="map">
    <div class="map__wrapper" :class="{ 'map__wrapper--error': isError }">
      <p class="map__number">Шаг 3</p>
      <h3 class="map__title title-sm">Укажите место на карте *</h3>
      <UiMap />
    </div>
  </section>
</template>

<script setup>
const map = ref(null);

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  isError: Boolean,
});
</script>

<style lang="scss" scoped>
.map {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    position: relative;
    border-radius: $border-r-md;
    border: 2px solid $secondary-accent;
    padding: $padding-xxl $padding-md $padding-md $padding-md;
    box-shadow: $box-shadow;
    &--error {
      border: 2px solid $red-300;
    }
  }
  &__number {
    position: absolute;
    top: -20px;
    font-size: 20px;
    background-color: $secondary-accent;
    // width: 60px;
    // height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $white;
    border-radius: $border-r-md;
    padding: $padding-xs $padding-md;
  }
}
</style>
