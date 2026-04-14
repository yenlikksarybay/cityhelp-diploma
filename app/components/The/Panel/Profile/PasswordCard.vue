<template>
  <section class="password-card">
    <div class="password-card__head">
      <div>
        <h3 class="password-card__title">Сброс пароля</h3>
        <p class="password-card__subtitle">
          Для безопасности подтвердите текущий пароль и задайте новый.
        </p>
      </div>
      <UiIcon icon="key-i" size="size-24" color="#606C38" />
    </div>

    <div class="password-card__form">
      <UiInput
        type="password"
        label="Текущий пароль"
        name="oldPassword"
        v-model="oldPassword"
        placeholder="Введите текущий пароль"
      />
      <UiInput
        type="password"
        label="Новый пароль"
        name="newPassword"
        v-model="newPassword"
        placeholder="Введите новый пароль"
      />
      <UiInput
        type="password"
        label="Повторите новый пароль"
        name="confirmPassword"
        v-model="confirmPassword"
        placeholder="Повторите новый пароль"
      />
    </div>

    <div class="password-card__actions">
      <UiButton
        class="primary-btn password-card__btn"
        label="Обновить пароль"
        :disabled="isSaving"
        @action="emit('save')"
      />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }),
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const oldPassword = computed({
  get: () => props.modelValue?.oldPassword || "",
  set: (value) =>
    emit("update:modelValue", { ...props.modelValue, oldPassword: value }),
});

const newPassword = computed({
  get: () => props.modelValue?.newPassword || "",
  set: (value) =>
    emit("update:modelValue", { ...props.modelValue, newPassword: value }),
});

const confirmPassword = computed({
  get: () => props.modelValue?.confirmPassword || "",
  set: (value) =>
    emit("update:modelValue", { ...props.modelValue, confirmPassword: value }),
});
</script>

<style lang="scss" scoped>
.password-card {
  padding: $padding-xl;
  border-radius: $border-r-lg;
  background: $white;
  box-shadow: $box-shadow;
  display: flex;
  flex-direction: column;
  gap: $gap-lg;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $gap-md;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
  }

  &__subtitle {
    margin-top: 6px;
    color: $surface-500;
    line-height: 1.45;
  }

  &__form {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: $gap-md;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__btn {
    min-width: 240px;
  }
}

@media (max-width: 768px) {
  .password-card {
    padding: $padding-lg;

    &__form {
      grid-template-columns: 1fr;
    }

    &__btn {
      width: 100%;
      min-width: 0;
    }
  }
}
</style>
