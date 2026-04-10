<template>
  <div class="table">
    <div class="table__wrapper">
      <table class="table__table">
        <thead class="table__head">
          <tr class="table__row">
            <th class="table__cell table__cell--head">{{ "Описание" }}</th>
            <th class="table__cell table__cell--head">
              {{ "Категория" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Приоритет" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Пользователь" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Дата регистрации" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Сотрудник" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Статус" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Действие" }}
            </th>
          </tr>
        </thead>
        <tbody class="table__body" v-if="rows.length">
          <tr class="table__row" v-for="(row, index) in rows" :key="row.id">
            <td class="table__cell table__cell--topic">
              {{ row.description }}
            </td>
            <td class="table__cell">
              <p>{{ row.category }}</p>
            </td>
            <td class="table__cell">
              <UiStatusText :status="normalizeUiStatus(row.priority)" :text="priorityText(row.priority)" />
            </td>
            <td class="table__cell">
              {{ row.user?.name || row.user?.email || row.userName || "?" }}
            </td>
            <td class="table__cell">
              {{ formatDateToDots(row.createdAt) || "?" }}
            </td>
            <td class="table__cell">
              {{ row.assignedEmployee?.name || row.employeeName || "Не назначен" }}
            </td>
            <td class="table__cell">
              <UiStatus :status="normalizeUiStatus(row.status)" :text="statusText(row.status)" />
            </td>
            <td class="table__cell">
              <UiButton
                tag="a"
                :href="`/panel/appeal/${row.id}`"
                label="Перейти"
                class="secondary-btn"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
});

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
    default:
      return "На модерации";
  }
};

const normalizeUiStatus = (status) => {
  switch (status) {
    case "completed":
    case "rated":
      return "solved";
    case "rejected":
      return "rejected";
    default:
      return "pending";
  }
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  overflow-x: scroll;

  &__wrapper {
    width: 100%;
  }
  &__table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    overflow-x: scroll;
  }
  &__row {
    background-color: $surface-100;
    &:hover {
      background-color: red !important;
    }
  }
  &__body {
    & .table-list__row:last-child .table-list__cell {
      border: none;
    }
  }
  &__status {
    padding: $padding-xs;
    border-radius: $border-r-md;
    background-color: $yellow-400;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $gap-sm;
    &--success {
      background-color: $green-500;
      color: $white;
    }
    &--failure {
      background-color: $red-300;
      color: $white;
    }
  }
  &__cell {
    padding: $padding-sm;
    text-align: center;
    margin: auto 0;
    border-bottom: 1px solid $surface-200;
    background-color: $white;
    height: 100%;
    &--head {
      background-color: $surface-150;
      padding: $padding-md;
      // border-radius: $border-r-md;
      // border: 1px solid $secondary-accent;
      &:first-child {
        border-top-left-radius: $border-r-md;
      }
      &:last-child {
        border-top-right-radius: $border-r-md;
      }
    }
    // &--actions {
    //   display: flex;
    //   justify-content: center;
    //   gap: $gap-md;
    // }
  }
  &__btn {
    &--delete {
      border: 1px solid $red-300;
      color: $red-300;
    }
  }
}
</style>
