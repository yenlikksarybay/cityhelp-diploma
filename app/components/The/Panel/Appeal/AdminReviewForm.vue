<template>
  <section v-if="show" class="review">
    <div class="review__wrapper">
      <h4 class="review__title title-md title-point">{{ title }}</h4>

      <div class="review__field">
        <p class="review__label">Комментарий проверки</p>
        <UiTextarea
          v-model="comment"
          placeholder="Напишите комментарий проверки"
        />
      </div>

      <div v-if="!canApprove" class="review__warning">
        {{ missingEmployeeMessage }}
      </div>

      <div class="review__actions">
        <UiButton
          class="review__btn secondary-btn"
          :label="isSubmitting ? '...' : rejectLabel"
          :disabled="isSubmitting"
          @action="submit(false)"
        />
        <UiButton
          class="review__btn primary-btn"
          :label="isSubmitting ? '...' : approveLabel"
          :disabled="isSubmitting || !canApprove"
          @action="submit(true)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["review"]);

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  canApprove: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Проверка модерации",
  },
  approveLabel: {
    type: String,
    default: "Подтвердить модерацию",
  },
  rejectLabel: {
    type: String,
    default: "Вернуть на доработку",
  },
  missingEmployeeMessage: {
    type: String,
    default: "Назначьте сотрудника перед подтверждением модерации.",
  },
});

const comment = ref("");

const submit = (isOk) => {
  if (isOk && !props.canApprove) {
    useNotify({
      title: "Нужно назначение",
      text: props.missingEmployeeMessage,
      status: "error",
    });
    return;
  }

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
  &__warning {
    padding: $padding-sm;
    border-radius: $border-r-sm;
    background: rgba($orange-500, 0.12);
    color: $orange-500;
    font-weight: 700;
  }
  &__btn {
    min-width: 220px;
  }
}
</style>
