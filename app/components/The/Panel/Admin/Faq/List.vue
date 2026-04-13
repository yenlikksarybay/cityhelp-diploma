<template>
  <div class="faq-list">
    <div class="faq-list__head">
      <UiInput
        before-icon="lupa-i"
        icon-size="size-20"
        placeholder="Поиск по вопросу"
        :model-value="search"
        @update:model-value="emit('update:search', $event)"
      />
    </div>

    <div class="faq-list__items">
      <article
        v-for="item in items"
        :key="item.id"
        class="faq-list__item"
      >
        <div class="faq-list__content">
          <p class="faq-list__question">{{ item.question }}</p>
          <p class="faq-list__meta">{{ item.category }} · {{ item.key }}</p>
          <p class="faq-list__answer">{{ item.answer }}</p>
        </div>
        <div class="faq-list__actions">
          <UiButton
            label="Редактировать"
            class="secondary-btn"
            @action="emit('select', item)"
          />
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  search: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["select", "update:search"]);
</script>

<style lang="scss" scoped>
.faq-list {
  display: flex;
  flex-direction: column;
  gap: $gap-md;

  &__items {
    display: grid;
    gap: $gap-md;
  }

  &__item {
    padding: $padding-md;
    background: $surface-100;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
  }

  &__content {
    display: grid;
    gap: 6px;
  }

  &__question {
    font-weight: 700;
  }

  &__meta {
    color: $surface-400;
    font-size: 13px;
  }

  &__answer {
    color: $surface-600;
    line-height: 160%;
  }

  &__actions {
    display: flex;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .faq-list {
    &__item {
      flex-direction: column;
    }
    &__actions {
      width: 100%;
    }
  }
}
</style>
