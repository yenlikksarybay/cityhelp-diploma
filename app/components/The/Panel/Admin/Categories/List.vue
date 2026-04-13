<template>
  <div class="category-list">
    <UiInput
      before-icon="lupa-i"
      icon-size="size-20"
      placeholder="Поиск по категории"
      :model-value="search"
      @update:model-value="emit('update:search', $event)"
    />

    <div class="category-list__items">
      <article
        v-for="item in items"
        :key="item.id"
        class="category-list__item"
      >
        <div class="category-list__content">
          <div class="category-list__top">
            <h4 class="category-list__name">{{ item.name }}</h4>
            <UiStatusText
              :status="item.isActive ? 'completed' : 'rejected'"
              :text="item.isActive ? 'Активна' : 'Скрыта'"
            />
          </div>
          <p class="category-list__meta">{{ item.key }}</p>
          <p class="category-list__desc">{{ item.description || "—" }}</p>
          <div v-if="item.subcategories?.length" class="category-list__chips">
            <span
              v-for="sub in item.subcategories"
              :key="sub"
              class="category-list__chip"
            >
              {{ sub }}
            </span>
          </div>
        </div>
        <div class="category-list__actions">
          <UiButton label="Редактировать" class="secondary-btn" @action="emit('select', item)" />
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
.category-list {
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
    gap: 8px;
  }

  &__top {
    display: flex;
    align-items: center;
    gap: $gap-md;
    flex-wrap: wrap;
  }

  &__meta {
    color: $surface-400;
    font-size: 13px;
  }

  &__desc {
    color: $surface-600;
    line-height: 160%;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__chip {
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba($secondary-accent, 0.08);
    color: $secondary-accent;
    font-size: 13px;
  }

  &__actions {
    display: flex;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .category-list {
    &__item {
      flex-direction: column;
    }
    &__actions {
      width: 100%;
    }
  }
}
</style>
