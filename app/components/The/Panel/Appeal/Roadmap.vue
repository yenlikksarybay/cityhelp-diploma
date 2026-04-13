<template>
  <section v-if="roadmap.length" class="roadmap">
    <div class="roadmap__wrapper">
      <h4 class="roadmap__title title-md title-point">Путь обращения</h4>

      <ul class="roadmap__list">
        <li
          v-for="(item, index) in roadmap"
          :key="`${item.statusFrom}-${item.statusTo}-${index}`"
          class="roadmap__item"
        >
          <p class="roadmap__route">
            {{ statusText(item.statusFrom) }} → {{ statusText(item.statusTo) }}
          </p>
          <p class="roadmap__meta">
            {{ formatDate(item.createdAt) }} · {{ item.title }}
          </p>
          <p v-if="item.text" class="roadmap__text">
            {{ item.text }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineProps({
  roadmap: {
    type: Array,
    default: () => [],
  },
});

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

const formatDate = (value) => {
  if (!value) return "—";
  return formatDateTimeToDots(value) || formatDateToDots(value) || "—";
};
</script>

<style lang="scss" scoped>
.roadmap {
  background-color: $white;
  border-radius: $border-r-md;
  box-shadow: $box-shadow;
  padding: $padding-md;
  border-radius: $border-r-md;
  background-color: $white;

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: $padding-sm;
    border-radius: $border-r-md;
    background-color: $surface-100;
  }

  &__route {
    font-weight: 700;
  }

  &__meta {
    color: $surface-500;
    font-size: 12px;
  }

  &__text {
    color: $surface-600;
    line-height: 1.45;
  }
}
</style>
