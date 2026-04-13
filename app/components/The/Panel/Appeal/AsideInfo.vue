<template>
  <div class="info">
    <div class="info__wrapper">
      <h4 class="info__title title-md title-point">Информация</h4>
      <ul class="info__ul">
        <li class="info__li" v-for="list in lists" :key="list.key">
          <p class="info__key">{{ list.key }}</p>
          <UiStatus
            class="info__value"
            v-if="list?.status"
            :status="list.status"
            :text="list.value"
          />
          <UiStatusText
            class="info__value"
            v-else-if="list?.level"
            :status="list.level"
            :text="list.value"
          />
          <p class="info__value" v-else>{{ list.value }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  appeal: {
    type: Object,
    default: null,
  },
});

const formatDate = (value) => {
  if (!value) return "—";
  return formatDateToDots(value) || "—";
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

const statusVariant = (status) => {
  switch (status) {
    case "completed":
    case "rated":
      return "completed";
    case "processing":
      return "processing";
    case "needs_revision":
      return "needs_revision";
    case "rejected":
      return "rejected";
    case "moderation":
      return "moderation";
    default:
      return "new";
  }
};

const priorityText = (priority) => {
  switch (priority) {
    case "urgent":
      return "Срочный";
    case "high":
      return "Высокий";
    case "low":
      return "Низкий";
    default:
      return "Средний";
  }
};

const hasModeratorEdit = computed(() =>
  (props.appeal?.timeline || []).some(
    (item) => item?.type === "moderator_edit",
  ),
);

const lists = computed(() => [
  {
    key: "От пользователя:",
    value:
      props.appeal?.user?.name ||
      [props.appeal?.user?.firstName, props.appeal?.user?.lastName]
        .filter(Boolean)
        .join(" ") ||
      "—",
  },
  {
    key: "Местоположение:",
    value:
      props.appeal?.location?.label || props.appeal?.location?.address || "—",
  },
  {
    key: "Категория:",
    value: props.appeal?.category || "—",
  },
  {
    key: "Сотрудник:",
    value:
      props.appeal?.employeeName ||
      props.appeal?.assignedEmployee?.name ||
      [
        props.appeal?.assignedEmployee?.firstName,
        props.appeal?.assignedEmployee?.lastName,
      ]
        .filter(Boolean)
        .join(" ") ||
      "—",
  },
  {
    key: "Статус:",
    value: statusText(props.appeal?.status),
    status: statusVariant(props.appeal?.status),
  },
  {
    key: "Приоритетность:",
    value: priorityText(props.appeal?.priority),
    level:
      props.appeal?.priority === "urgent"
        ? "urgent"
        : props.appeal?.priority === "high"
          ? "high"
          : props.appeal?.priority === "low"
            ? "low"
            : "medium",
  },
  {
    key: "Дата создания:",
    value: formatDate(props.appeal?.createdAt),
  },
  {
    key: "Дата закрытия:",
    value: formatDate(props.appeal?.closedAt),
  },
  {
    key: "Дедлайн:",
    value: formatDate(props.appeal?.deadlineAt),
  },
  {
    key: "Исправление:",
    value: hasModeratorEdit.value ? "Исправлено модератором" : "—",
  },
]);
</script>

<style lang="scss" scoped>
.info {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    box-shadow: $box-shadow;
    padding: $padding-md;
    border-radius: $border-r-md;
    background-color: $white;
  }
  &__ul {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $gap-xs;
  }
  &__value {
    font-weight: 500;
    text-align: right;
    // white-space: nowrap;
  }
}
</style>
