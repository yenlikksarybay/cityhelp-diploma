<template>
  <div class="become-employee-modal">
    <p class="become-employee-modal__text">
      Подтвердите действие, чтобы отправить заявку на переход в роль сотрудника. Пока администратор не примет решение, ваша текущая роль не изменится.
    </p>

    <div class="become-employee-modal__actions">
      <UiButton
        class="secondary-btn become-employee-modal__button"
        label="Отмена"
        @action="emit('close')"
      />
      <UiButton
        class="primary-btn become-employee-modal__button"
        label="Подтвердить"
        :disabled="isLoading"
        @action="emit('confirm')"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "confirm"]);
</script>

<style lang="scss" scoped>
.become-employee-modal {
  display: flex;
  flex-direction: column;
  gap: $gap-lg;

  &__text {
    color: $surface-500;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: $gap-md;
  }

  &__button {
    min-width: 160px;
  }
}

@media (max-width: 640px) {
  .become-employee-modal {
    &__actions {
      flex-direction: column-reverse;
    }

    &__button {
      width: 100%;
      min-width: 0;
    }
  }
}
</style>
