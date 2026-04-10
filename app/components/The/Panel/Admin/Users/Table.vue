<template>
  <div class="table">
    <div class="table__wrapper">
      <table class="table__table">
        <thead class="table__head">
          <tr class="table__row">
            <th class="table__cell table__cell--head">№</th>
            <th class="table__cell table__cell--head">
              {{ "ФИО" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Номер телефона" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "E-mail" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Колл. обращений" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Дата регистрации" }}
            </th>
          </tr>
        </thead>
        <tbody class="table__body" v-if="rows.length">
          <tr class="table__row" v-for="(row, index) in rows" :key="row.id">
            <td class="table__cell table__cell--topic">
              {{ index + 1 }}
            </td>
            <td class="table__cell">
              <p>{{ row.name }}</p>
            </td>
            <td class="table__cell">
              {{ formatKzPhone(row.phone || "") || "?" }}
            </td>
            <td class="table__cell">
              {{ row.email }}
            </td>
            <td class="table__cell">
              {{ row.user_appeals_count }}
            </td>
            <td class="table__cell">
              {{ formatDateToDots(row.createdAt) || "?" }}
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
  isLoading: {
    type: Boolean,
    default: false,
  },
});
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
  }
  &__body {
    & .table-list__row:last-child .table-list__cell {
      border: none;
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
