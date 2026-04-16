<template>
  <section v-if="show" class="rating">
    <div class="rating__wrapper">
      <h4 class="rating__title title-md title-point">Оцените работу</h4>
      <p class="rating__text">Поставьте лайк или дизлайк выполненной работе.</p>

      <div class="rating__actions">
        <UiButton
          class="rating__btn primary-btn"
          label="Оценить"
          :disabled="isSubmitting"
          @action="$emit('submit')"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["submit"]);

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.rating {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    padding: $padding-md;
    border-radius: $border-r-md;
    background: $surface-100;
  }
  &__text {
    color: $surface-500;
    font-size: 14px;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
  &__btn {
    min-width: 120px;
  }
}
</style>
