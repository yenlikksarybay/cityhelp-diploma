<template>
  <section class="card">
    <nuxt-link :to="`/panel/appeal/${card.id}`" class="card__wrapper">
      <img
        v-if="card?.photos?.[0]?.url"
        :src="card.photos[0].url"
        :alt="card.description || 'Обращение'"
        class="card__image"
      />
      <UiLoadImage v-else class="card__image" />

      <UiStatus
        :text="statusText(card.status)"
        :status="normalizeUiStatus(card.status)"
        class="card__status"
      />

      <div class="card__content">
        <h4 class="card__title title-sm">
          {{ card.description }}
        </h4>
        <ul class="card__ul">
          <li class="card__li" v-for="list in lists" :key="list.id">
            <UiIcon :icon="list.icon" size="size-20" />
            <p class="card__li-text">
              {{ list.name(card) }}
            </p>
          </li>
        </ul>
      </div>
    </nuxt-link>
  </section>
</template>

<script setup>
defineProps({
  card: {
    type: Object,
    default: () => ({}),
  },
});

const lists = [
  {
    id: 1,
    name: (card) =>
      card.location?.address || card.location?.label || "Без адреса",
    icon: "location-i",
  },
  {
    id: 2,
    name: (card) => priorityText(card.priority),
    icon: "status-i",
  },
];

const priorityText = (priority) => {
  switch (priority) {
    case "urgent":
      return "Срочный приоритет";
    case "high":
      return "Высокий приоритет";
    case "low":
      return "Низкий приоритет";
    default:
      return "Средний приоритет";
  }
};

const statusText = (status) => {
  switch (status) {
    case "completed":
      return "Завершено";
    case "rated":
      return "Оценено";
    case "processing":
      return "В работе";
    case "needs_revision":
      return "Нужна доработка";
    case "rejected":
      return "Отклонено";
    case "moderation":
      return "На модерации";
    default:
      return "Новое";
  }
};

const normalizeUiStatus = (status) => {
  return String(status || "").toLowerCase();
};
</script>

<style lang="scss" scoped>
.card {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    background-color: $surface-150;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
    border: 2px solid transparent;
    transition: 0.4s ease;
    position: relative;

    &:hover {
      border: 2px solid $secondary-accent;
      box-shadow: $box-shadow-md;
    }
  }
  &__content {
    padding: $padding-md;
    position: relative;
  }
  &__status {
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 12px;
  }
  &__image {
    height: 230px;
    width: 100%;
    border-radius: $border-r-md;
  }
  &__ul {
    display: flex;
    flex-wrap: wrap;
    gap: $gap-xl;
  }
  &__li {
    display: flex;
    align-items: center;
    gap: $gap-sm;
    &-text {
      font-size: 14px;
      color: $surface-400;
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
  }
}
</style>
