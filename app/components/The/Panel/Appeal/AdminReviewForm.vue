<template>
  <section v-if="show" class="review">
    <div class="review__wrapper">
      <h4 class="review__title title-md title-point">Проверка сотрудника</h4>

      <div class="review__field">
        <p class="review__label">Комментарий проверки</p>
        <UiTextarea v-model="comment" placeholder="Напишите комментарий проверки" />
      </div>

      <div class="review__actions">
        <UiButton
          class="review__btn secondary-btn"
          :label="isSubmitting ? '...' : 'Вернуть на доработку'"
          :disabled="isSubmitting"
          @action="submit(false)"
        />
        <UiButton
          class="review__btn primary-btn"
          :label="isSubmitting ? '...' : 'Подтвердить выполнение'"
          :disabled="isSubmitting"
          @action="submit(true)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["review"]);

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

const comment = ref("");

const submit = (isOk) => {
  emit("review", {
    isOk,
    note: comment.value.trim(),
  });
};
</script>

<style lang="scss" scoped>
.review {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    padding: $padding-md;
    border-radius: $border-r-md;
    background: $surface-100;
  }
  &__field {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
  }
  &__label {
    font-weight: 700;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: $gap-md;
    flex-wrap: wrap;
  }
  &__btn {
    min-width: 220px;
  }
}
</style>
