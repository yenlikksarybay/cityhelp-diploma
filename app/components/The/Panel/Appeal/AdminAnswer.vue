<template>
  <section class="answer">
    <div class="answer__wrapper">
      <h4 class="answer__title title-md title-point">Ответ на обращение</h4>

      <div v-if="text" class="answer__box">
        <div class="answer__top">
          <p class="answer__role">
            {{ authorLabel }} - <span class="answer__baige">{{ authorName }}</span>
          </p>
          <p class="answer__date">{{ formatDate(props.appeal?.updatedAt || props.appeal?.createdAt) }}</p>
        </div>
        <p class="answer__comment">{{ text }}</p>
        <div v-if="props.appeal?.employeeNote" class="answer__vision">
          <p class="answer__vision-title">Комментарий сотрудника</p>
          <p class="answer__vision-text">{{ props.appeal.employeeNote }}</p>
        </div>
        <div v-if="props.appeal?.moderationNote" class="answer__vision">
          <p class="answer__vision-title">Комментарий проверки</p>
          <p class="answer__vision-text">{{ props.appeal.moderationNote }}</p>
        </div>
        <div v-if="props.appeal?.aiResult?.photoObservation" class="answer__vision">
          <p class="answer__vision-title">Что увидел AI на фото</p>
          <p class="answer__vision-text">{{ props.appeal.aiResult.photoObservation }}</p>
        </div>
        <div v-if="props.appeal?.aiResult?.deadlineDate" class="answer__vision">
          <p class="answer__vision-title">Дедлайн по AI</p>
          <p class="answer__vision-text">{{ props.appeal.aiResult.deadlineDate }}</p>
        </div>
      </div>
      <div v-else class="answer__empty">
        Пока нет ответа
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  appeal: {
    type: Object,
    default: null,
  },
});

const authorLabel = computed(() => {
  if (props.appeal?.employeeNote) return "Сотрудник";
  if (props.appeal?.moderationNote) return "Модератор";
  return "AI";
});

const authorName = computed(() => {
  return props.appeal?.assignedEmployee?.name || "CityHelp";
});

const text = computed(() => {
  return (
    props.appeal?.employeeNote ||
    props.appeal?.moderationNote ||
    props.appeal?.aiResult?.shortSummary ||
    ""
  );
});

const formatDate = (value) => {
  if (!value) return "—";
  return formatDateToDots(value) || "—";
};
</script>

<style lang="scss" scoped>
.answer {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__box {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
    background-color: $surface-100;
    padding: $padding-md;
    border-radius: $border-r-md;
  }
  &__baige {
    background-color: $secondary-accent;
    color: $white;
    padding: 4px $padding-xs;
    border-radius: $border-r-md;
  }
  &__role {
    font-weight: 500;
  }
  &__top {
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
    align-items: center;
  }
  &__comment {
    line-height: 120%;
    color: $surface-600;
  }
  &__vision {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: $padding-sm;
    border-radius: $border-r-md;
    background-color: $surface-150;
  }
  &__vision-title {
    font-size: 12px;
    font-weight: 600;
    color: $surface-500;
  }
  &__vision-text {
    line-height: 130%;
    color: $surface-600;
  }
  &__empty {
    border-radius: $border-r-md;
    background-color: $surface-100;
    padding: $padding-md;
    color: $surface-500;
  }
  &__date {
    color: $surface-300;
    font-size: 12px;
  }
}
</style>
