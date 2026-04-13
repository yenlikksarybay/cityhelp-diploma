<template>
  <section class="list">
    <div class="list__head">
      <div>
        <h3 class="title-sm">Список промтов</h3>
        <p class="list__text">Ниже все сохранённые промты для быстрого выбора.</p>
      </div>
      <UiButton
        label="Новый"
        class="list__button primary-btn"
        before-icon="plus-i"
        icon-color="white"
        icon-size="size-20"
        @action="$emit('reset')"
      />
    </div>

    <div class="list__filters">
      <UiInput
        :model-value="search"
        label="Поиск"
        placeholder="Key, название, текст"
        before-icon="lupa-i"
        icon-size="size-20"
        @update:model-value="$emit('update:search', $event)"
      />
      <UiSelect
        :model-value="selectedFilterModule"
        label="Модуль"
        placeholder="Выберите модуль"
        :options="filterModuleOptions"
        :is-search="false"
        :is-clear="false"
        @update:model-value="$emit('update:filter-module', $event)"
      />
    </div>

    <div class="list__grid">
      <button
        v-for="prompt in prompts"
        :key="prompt.id"
        type="button"
        class="list__item"
        :class="{ 'list__item--active': prompt.id === selectedPromptId }"
        @click="$emit('select', prompt)"
      >
        <div class="list__item-top">
          <span class="list__badge">{{ prompt.moduleLabel }}</span>
          <span class="list__badge">{{ prompt.toneLabel }}</span>
          <span class="list__badge" :class="{ 'list__badge--muted': !prompt.isActive }">
            {{ prompt.isActive ? `v${prompt.version || 1}` : "Архив" }}
          </span>
        </div>
        <p class="list__item-title">{{ prompt.name }}</p>
        <p class="list__item-key">{{ prompt.key }}</p>
        <p class="list__item-preview">{{ prompt.systemPrompt }}</p>
      </button>

      <div v-if="!prompts.length" class="list__empty">
        <p class="list__empty-title">Ничего не найдено</p>
        <p class="list__empty-text">Измени поиск или фильтр по модулю.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  prompts: { type: Array, required: true },
  search: { type: String, default: "" },
  selectedPromptId: { type: [Number, String], default: null },
  selectedFilterModule: { type: Object, required: true },
  filterModuleOptions: { type: Array, required: true },
});

defineEmits(["reset", "select", "update:search", "update:filter-module"]);
</script>

<style lang="scss" scoped>
.list {
  background-color: $white;
  border-radius: $border-r-lg;
  box-shadow: $box-shadow;
  border: 1px solid $surface-200;
  padding: $padding-lg;
  display: flex;
  flex-direction: column;
  gap: $gap-lg;

  &__head {
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
    align-items: flex-start;
  }

  &__text {
    color: $surface-500;
    margin-top: 4px;
  }

  &__filters {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $gap-sm;
  }

  &__item {
    width: 100%;
    text-align: left;
    padding: 14px;
    border-radius: $border-r-md;
    border: 1px solid $surface-200;
    background-color: #fbfcfb;

    &--active {
      border-color: $green-500;
      background-color: #eef8ee;
    }
  }

  &__item-top {
    display: flex;
    flex-wrap: wrap;
    gap: $gap-sm;
    margin-bottom: 10px;
  }

  &__badge {
    font-size: 12px;
    font-weight: 600;
    padding: 5px 8px;
    border-radius: 999px;
    background-color: $white;
    color: $surface-600;

    &--muted {
      background-color: $surface-150;
      color: $surface-500;
    }
  }

  &__item-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  &__item-key {
    font-size: 13px;
    color: $green-500;
    margin-bottom: 8px;
  }

  &__item-preview {
    font-size: 14px;
    color: $surface-500;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__button {
    background-color: $green-500;
    color: $white;
  }

  &__empty {
    padding: 32px 18px;
    text-align: center;
    border: 1px dashed $surface-300;
    border-radius: $border-r-md;
    background-color: #fbfbfb;
    grid-column: 1 / -1;
  }

  &__empty-title {
    font-weight: 700;
    margin-bottom: 4px;
  }

  &__empty-text {
    color: $surface-500;
  }
}

@media (max-width: 1200px) {
  .list {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 625px) {
  .list {
    &__head {
      flex-direction: column;
    }
  }
}
</style>
