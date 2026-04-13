<template>
  <section class="info-card">
    <div class="info-card__head">
      <div>
        <h3 class="info-card__title">Основные данные</h3>
        <p class="info-card__subtitle">
          Можно менять только имя и фамилию. Телефон и email остаются только для чтения.
        </p>
      </div>
      <UiIcon icon="user-i" size="size-24" color="#606C38" />
    </div>

    <div class="info-card__form">
      <UiInput
        label="Имя"
        name="firstName"
        v-model="firstName"
        placeholder="Введите имя"
      />
      <UiInput
        label="Фамилия"
        name="lastName"
        v-model="lastName"
        placeholder="Введите фамилию"
      />
      <UiInput
        label="Телефон"
        name="phone"
        v-model="phone"
        disabled
      />
      <UiInput
        label="E-mail"
        name="email"
        v-model="email"
        disabled
      />
    </div>

    <div class="info-card__actions">
      <UiButton
        class="primary-btn info-card__btn"
        label="Сохранить изменения"
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
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    }),
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const firstName = computed({
  get: () => props.modelValue?.firstName || "",
  set: (value) => emit("update:modelValue", { ...props.modelValue, firstName: value }),
});

const lastName = computed({
  get: () => props.modelValue?.lastName || "",
  set: (value) => emit("update:modelValue", { ...props.modelValue, lastName: value }),
});

const phone = computed(() => props.modelValue?.phone || "");
const email = computed(() => props.modelValue?.email || "");
</script>

<style lang="scss" scoped>
.info-card {
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
  .info-card {
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
