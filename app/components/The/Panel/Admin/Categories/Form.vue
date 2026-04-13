<template>
  <section class="category-form">
    <div class="category-form__head">
      <h3 class="title-sm">{{ isEditing ? "Редактировать категорию" : "Новая категория" }}</h3>
      <UiButton
        v-if="isEditing"
        label="Сбросить"
        class="secondary-btn"
        @action="emit('reset')"
      />
    </div>

    <div class="category-form__grid">
      <UiInput
        :model-value="modelValue.key"
        label="Ключ"
        placeholder="roads"
        @update:model-value="emit('update:modelValue', { ...modelValue, key: $event })"
      />
      <UiInput
        :model-value="modelValue.name"
        label="Название"
        placeholder="Дороги"
        @update:model-value="emit('update:modelValue', { ...modelValue, name: $event })"
      />
      <UiInput
        :model-value="modelValue.order"
        type="number"
        label="Порядок"
        placeholder="1"
        @update:model-value="emit('update:modelValue', { ...modelValue, order: $event })"
      />
      <UiInput
        :model-value="modelValue.subcategories"
        label="Подкатегории"
        placeholder="Ямы, Освещение, Разметка"
        @update:model-value="emit('update:modelValue', { ...modelValue, subcategories: $event })"
      />
    </div>

    <UiTextarea
      :model-value="modelValue.description"
      label="Описание"
      placeholder="Краткое описание категории..."
      @update:model-value="emit('update:modelValue', { ...modelValue, description: $event })"
    />

    <div class="category-form__actions">
      <UiButton label="Сохранить" class="primary-btn" before-icon="checkmark-i" @action="emit('save')" />
      <UiButton
        v-if="isEditing"
        label="Удалить"
        class="secondary-btn category-form__delete"
        before-icon="close"
        @action="emit('remove')"
      />
    </div>
  </section>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["reset", "remove", "save", "update:modelValue"]);
</script>

<style lang="scss" scoped>
.category-form {
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
  .category-form {
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
