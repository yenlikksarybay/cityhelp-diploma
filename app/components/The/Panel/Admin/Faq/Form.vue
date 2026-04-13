<template>
  <section class="faq-form">
    <div class="faq-form__head">
      <h3 class="title-sm">{{ isEditing ? "Редактировать FAQ" : "Новый FAQ" }}</h3>
      <UiButton
        v-if="isEditing"
        label="Сбросить"
        class="secondary-btn"
        @action="emit('reset')"
      />
    </div>

    <div class="faq-form__grid">
      <UiInput
        :model-value="form.key"
        label="Ключ"
        placeholder="faq-registration"
        @update:model-value="emit('update:field', 'key', $event)"
      />
      <UiInput
        :model-value="form.category"
        label="Категория"
        placeholder="Общие вопросы"
        @update:model-value="emit('update:field', 'category', $event)"
      />
      <UiInput
        :model-value="form.order"
        type="number"
        label="Порядок"
        placeholder="1"
        @update:model-value="emit('update:field', 'order', $event)"
      />
      <UiInput
        :model-value="form.question"
        label="Вопрос"
        placeholder="Как создать обращение?"
        @update:model-value="emit('update:field', 'question', $event)"
      />
    </div>

    <UiTextarea
      :model-value="form.answer"
      label="Ответ"
      placeholder="Подробный ответ..."
      @update:model-value="emit('update:field', 'answer', $event)"
    />

    <div class="faq-form__actions">
      <UiButton
        label="Сохранить"
        class="primary-btn"
        before-icon="checkmark-i"
        @action="emit('save')"
      />
      <UiButton
        v-if="isEditing"
        label="Удалить"
        class="secondary-btn faq-form__delete"
        before-icon="close"
        @action="emit('remove')"
      />
    </div>
  </section>
</template>

<script setup>
defineProps({
  form: {
    type: Object,
    default: () => ({}),
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["reset", "remove", "save", "update:field"]);
</script>

<style lang="scss" scoped>
.faq-form {
  display: flex;
  flex-direction: column;
  gap: $gap-md;
  padding: $padding-lg;
  background: $surface-100;
  border-radius: $border-r-md;
  box-shadow: $box-shadow;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $gap-md;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $gap-md;
  }

  &__actions {
    display: flex;
    gap: $gap-md;
    justify-content: flex-end;
  }

  &__delete {
    border: 1px solid $red-300;
    color: $red-300;
  }
}

@media (max-width: 768px) {
  .faq-form {
    &__grid {
      grid-template-columns: 1fr;
    }
    &__actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>
