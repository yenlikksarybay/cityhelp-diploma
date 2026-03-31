<template>
  <div class="editor">
    <div class="editor__toolbar">
      <div>
        <p class="editor__label">Редактор</p>
        <h3 class="title-sm">
          {{ isEditing ? "Редактирование промта" : "Создание нового промта" }}
        </h3>
      </div>

      <div class="editor__actions">
        <UiButton
          label="Очистить"
          class="editor__button editor__button--ghost secondary-btn"
          before-icon="close"
          icon-color="surface-400"
          icon-size="size-18"
          @action="$emit('reset')"
        />
        <UiButton
          v-if="isEditing"
          label="Удалить"
          class="editor__button editor__button--danger secondary-btn"
          before-icon="trash-i"
          icon-color="red-300"
          icon-size="size-18"
          @action="$emit('remove')"
        />
        <UiButton
          label="Сохранить"
          class="editor__button editor__button--save primary-btn"
          before-icon="checkmark-i"
          icon-color="white"
          icon-size="size-20"
          @action="$emit('save')"
        />
      </div>
    </div>

    <div class="editor__body">
      <div class="editor__card">
        <div class="editor__head">
          <h4>Основная информация</h4>
          <p>Ключ, название и назначение промта.</p>
        </div>

        <div class="editor__grid">
          <UiInput
            :model-value="form.key"
            label="Key"
            placeholder="Например: appeal_moderation"
            :is-error="submitted && !form.key.trim()"
            @update:model-value="$emit('update:field', 'key', $event)"
          />
          <UiInput
            :model-value="form.name"
            label="Название"
            placeholder="Например: Модерация обращений"
            :is-error="submitted && !form.name.trim()"
            @update:model-value="$emit('update:field', 'name', $event)"
          />
          <UiSelect
            :model-value="selectedModule"
            label="Модуль"
            placeholder="Выберите модуль"
            :options="moduleOptions"
            :is-search="false"
            :is-clear="false"
            @update:model-value="$emit('update:module', $event)"
          />
          <UiSelect
            :model-value="selectedTone"
            label="Тон"
            placeholder="Выберите тон"
            :options="toneOptions"
            :is-search="false"
            :is-clear="false"
            @update:model-value="$emit('update:tone', $event)"
          />
        </div>
      </div>

      <div class="editor__card">
        <div class="editor__head">
          <h4>Инструкции модели</h4>
          <p>Здесь описывается логика и поведение AI.</p>
        </div>

        <div class="editor__stack">
          <div class="editor__field">
            <p class="editor__field-label">System Prompt</p>
            <UiTextarea
              :model-value="form.systemPrompt"
              placeholder="Роль модели, задача, стиль ответа, ограничения"
              :max-length="1200"
              @update:model-value="$emit('update:field', 'systemPrompt', $event)"
            />
          </div>
          <div class="editor__field">
            <p class="editor__field-label">User Template</p>
            <UiTextarea
              :model-value="form.userTemplate"
              placeholder="Шаблон пользовательского запроса или подстановок"
              :max-length="1000"
              @update:model-value="$emit('update:field', 'userTemplate', $event)"
            />
          </div>
          <div class="editor__field">
            <p class="editor__field-label">Guardrails</p>
            <UiTextarea
              :model-value="form.guardrails"
              placeholder="Ограничения, запреты и рамки ответа"
              :max-length="800"
              @update:model-value="$emit('update:field', 'guardrails', $event)"
            />
          </div>
        </div>
      </div>

      <div class="editor__card">
        <div class="editor__head">
          <h4>Примеры</h4>
          <p>Нужны, чтобы зафиксировать ожидаемый формат работы.</p>
        </div>

        <div class="editor__grid">
          <div class="editor__field">
            <p class="editor__field-label">Пример входа</p>
            <UiTextarea
              :model-value="form.exampleInput"
              placeholder="Пример входных данных"
              :max-length="500"
              @update:model-value="$emit('update:field', 'exampleInput', $event)"
            />
          </div>
          <div class="editor__field">
            <p class="editor__field-label">Пример выхода</p>
            <UiTextarea
              :model-value="form.exampleOutput"
              placeholder="Пример ожидаемого ответа"
              :max-length="500"
              @update:model-value="$emit('update:field', 'exampleOutput', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  form: { type: Object, required: true },
  submitted: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
  selectedModule: { type: Object, required: true },
  selectedTone: { type: Object, required: true },
  moduleOptions: { type: Array, required: true },
  toneOptions: { type: Array, required: true },
});

defineEmits([
  "reset",
  "remove",
  "save",
  "update:field",
  "update:module",
  "update:tone",
]);
</script>

<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: $gap-lg;

  &__toolbar,
  &__card {
    background-color: $white;
    border-radius: $border-r-lg;
    box-shadow: $box-shadow;
    border: 1px solid $surface-200;
  }

  &__toolbar {
    padding: 16px 18px;
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
    align-items: center;
  }

  &__label {
    color: $surface-500;
    font-size: 13px;
    margin-bottom: 4px;
  }

  &__actions {
    display: flex;
    gap: $gap-sm;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $gap-lg;
  }

  &__card {
    padding: 18px;
  }

  &__head {
    margin-bottom: $gap-lg;

    h4 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    p {
      color: $surface-500;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $gap-md;
  }

  &__stack {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__field-label {
    font-size: 14px;
    font-weight: 600;
    color: $surface-600;
  }

  &__button {
    &--save {
      background-color: $green-500;
      color: $white;
    }

    &--ghost {
      border: 1px solid $surface-300;
      color: $surface-500;
    }

    &--danger {
      border: 1px solid $red-300;
      color: $red-300;
    }
  }
}

@media (max-width: 900px) {
  .editor {
    &__toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    &__actions {
      width: 100%;
    }

    &__grid {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 625px) {
  .editor {
    &__actions {
      flex-direction: column;
    }
  }
}
</style>
