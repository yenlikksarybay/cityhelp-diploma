<template>
  <section class="list">
    <h3 class="list__title title-md">Cписок переводов</h3>
    <div class="list__filters">
      <UiInput
        :model-value="search"
        label="Поиск"
        placeholder="Поиск по key или переводу"
        before-icon="lupa-i"
        icon-size="size-20"
        @update:model-value="$emit('update:search', $event)"
      />
      <UiSelect
        :model-value="selectedLanguage"
        label="Язык"
        placeholder="Выберите язык"
        :options="languageOptions"
        :is-search="false"
        :is-clear="false"
        @update:model-value="$emit('update:language', $event)"
      />
    </div>

    <div class="list__items">
      <article
        v-for="translation in translations"
        :key="translation.id"
        class="list__card"
        :class="{
          'list__card--active': translation.id === selectedTranslationId,
        }"
      >
        <div class="list__head">
          <div>
            <p class="list__key">{{ translation.key }}</p>
            <p class="list__date">Обновлено: {{ translation.updatedAt }}</p>
          </div>
          <div class="list__actions">
            <UiButton
              label="Изменить"
              before-icon="document-pen-i"
              icon-color="white"
              icon-size="size-18"
              @action="$emit('edit', translation)"
            />
            <UiButton
              label="Удалить"
              class="list__button list__button--delete secondary-btn"
              before-icon="trash-i"
              icon-color="red-300"
              icon-size="size-20"
              @action="$emit('remove', translation.id)"
            />
          </div>
        </div>

        <div class="list__grid">
          <div class="list__locale">
            <span class="list__badge">KZ</span>
            <p>{{ translation.kz }}</p>
          </div>
          <div class="list__locale">
            <span class="list__badge">RU</span>
            <p>{{ translation.ru }}</p>
          </div>
          <div class="list__locale">
            <span class="list__badge">EN</span>
            <p>{{ translation.en }}</p>
          </div>
        </div>
      </article>

      <div v-if="!translations.length" class="list__empty">
        <p class="list__empty-title">Ничего не найдено</p>
        <p class="list__empty-text">
          Попробуйте изменить поиск или язык фильтрации.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  translations: { type: Array, required: true },
  search: { type: String, default: "" },
  selectedLanguage: { type: Object, required: true },
  languageOptions: { type: Array, required: true },
  selectedTranslationId: { type: Number, default: null },
});

defineEmits(["update:search", "update:language", "edit", "remove"]);
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: $gap-lg;

  &__filters {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: $gap-md;
    align-items: end;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }

  &__card {
    padding: $padding-lg;
    border-radius: $border-r-md;
    background-color: $white;
    box-shadow: $box-shadow;
    border: 1px solid transparent;

    &--active {
      border-color: $secondary-accent;
      transform: translateY(-2px);
    }
  }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $gap-md;
    margin-bottom: $gap-md;
  }

  &__key {
    font-size: 18px;
    font-weight: 700;
  }

  &__date {
    color: $surface-500;
    margin-top: 4px;
  }

  &__actions {
    display: flex;
    gap: $gap-sm;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: $gap-md;
  }

  &__locale {
    background-color: $surface-100;
    border-radius: $border-r-md;
    padding: $padding-md;
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
    min-height: 120px;
    line-height: 1.5;
  }

  &__badge {
    width: fit-content;
    padding: 6px 10px;
    border-radius: 999px;
    background-color: $white;
    color: $secondary-accent;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  &__button {
    &--delete {
      border: 1px solid $red-300;
      color: $red-300;
    }
  }

  &__empty {
    padding: 48px 24px;
    text-align: center;
    background-color: $white;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
  }

  &__empty-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: $gap-sm;
  }

  &__empty-text {
    color: $surface-500;
  }
}

@media (max-width: 900px) {
  .list {
    &__head {
      flex-direction: column;
    }

    &__actions {
      width: 100%;
    }

    &__filters,
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
