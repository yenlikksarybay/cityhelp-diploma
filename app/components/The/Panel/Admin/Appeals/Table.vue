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
              {{ "Проритет" }}
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
          </tr>
        </thead>
        <tbody class="table__body" v-if="students.length">
          <tr class="table__row" v-for="(row, index) in students" :key="row.id">
            <td class="table__cell table__cell--topic">
              {{ row.description }}
            </td>
            <td class="table__cell">
              <p>{{ row.category }}</p>
            </td>
            <td class="table__cell">
              {{ formatKzPhone(row.phone || "") || "?" }}
            </td>
            <td class="table__cell">
              {{ row.email }}
            </td>
            <td class="table__cell">
              {{ formatDateToDots(row.created_at) || "?" }}
            </td>
            <td class="table__cell">
              {{ row.employee }}
            </td>
            <td class="table__cell">
              <UiStatus :status="row.status" :text="row.status" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const students = [
  {
    description: "Надо чинить дорогу",
    category: "Починить",
    phone: "Низкая",
    email: "Иван",
    employee: "Сергей",
    user_appeals_count: 0,
    created_at: "2024-01-01T00:00:00.000Z",
    status: "pending",
  },
];
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
