<template>
  <div class="form">
    <div class="form__panel">
      <div class="form__head">
        <h3 class="title-sm">
          {{ isEditing ? "Редактирование перевода" : "Новый перевод" }}
        </h3>
        <p class="form__subtitle">Заполните ключ и тексты для всех языков.</p>
      </div>

      <div class="form__fields">
        <UiInput
          :model-value="form.key"
          label="Key"
          placeholder="Например: panel.title"
          :is-error="submitted && !form.key.trim()"
          @update:model-value="$emit('update:field', 'key', $event)"
        />
        <UiInput
          :model-value="form.kz"
          placeholder="Текст на казахском"
          label="Kz"
          @update:model-value="$emit('update:field', 'kz', $event)"
        />
        <UiInput
          :model-value="form.ru"
          placeholder="Текст на русском"
          label="Ru"
          @update:model-value="$emit('update:field', 'ru', $event)"
        />
        <UiInput
          :model-value="form.en"
          placeholder="Text in English"
          label="En"
          @update:model-value="$emit('update:field', 'en', $event)"
        />
      </div>

      <div class="form__actions">
        <UiButton
          label="Очистить"
          class="form__button form__button--cancel secondary-btn"
          before-icon="close"
          icon-color="surface-400"
          icon-size="size-20"
          @action="$emit('reset')"
        />
        <UiButton
          label="Сохранить перевод"
          class="form__button form__button--save primary-btn"
          before-icon="checkmark-i"
          icon-color="surface-200"
          icon-size="size-20"
          @action="$emit('save')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  form: { type: Object, required: true },
  submitted: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
});

defineEmits(["reset", "save", "update:field"]);
</script>

<style lang="scss" scoped>
.form {
  &__panel {
    display: flex;
    flex-direction: column;
    gap: $gap-lg;
    padding: $padding-lg;
    border-radius: $border-r-md;
    background-color: $white;
    box-shadow: $box-shadow;
  }

  &__head {
    display: flex;
    flex-direction: column;
    gap: $gap-xs;
  }

  &__subtitle {
    color: $surface-500;
  }

  &__fields {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $gap-md;
    align-items: center;
  }

  &__actions {
    display: flex;
    gap: $gap-md;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  &__button {
    &--delete {
      border: 1px solid $red-300;
      color: $red-300;
    }
  }
}

@media (max-width: 900px) {
  .form {
    &__fields {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 625px) {
  .form {
    &__actions {
      flex-direction: column;
    }
  }
}
</style>
