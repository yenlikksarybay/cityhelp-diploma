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
              {{ "Количество обращений" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Положительные" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Отрицательные" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Рейтинг" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Дата регистрации" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Действие" }}
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
              <span class="table__count table__count--primary">
                {{ row.user_appeals_count || 0 }}
              </span>
            </td>
            <td class="table__cell">
              <span class="table__count table__count--success">
                {{ row.positive_rating_count || 0 }}
              </span>
            </td>
            <td class="table__cell">
              <span class="table__count table__count--danger">
                {{ row.negative_rating_count || 0 }}
              </span>
            </td>
            <td class="table__cell">
              <span class="table__count table__count--rating">
                {{ formatRating(row.average_rating) }}
              </span>
            </td>
            <td class="table__cell">
              {{ formatDateToDots(row.createdAt) || "?" }}
            </td>
            <td class="table__cell">
              <UiButton
                tag="a"
                :href="`/panel/admin/staff/${row.id}`"
                label="Подробнее"
                class="table__link secondary-btn"
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
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const formatRating = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  return Number(value).toFixed(1);
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

  &__count {
    display: inline-flex;
    min-width: 34px;
    justify-content: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-weight: 700;
    &--primary {
      background-color: rgba($green-500, 0.12);
      color: $green-500;
    }
    &--success {
      background-color: rgba($green-500, 0.12);
      color: $green-500;
    }
    &--danger {
      background-color: rgba($red-300, 0.12);
      color: $red-300;
    }
    &--rating {
      background-color: rgba($secondary-accent, 0.12);
      color: $secondary-accent;
    }
  }

  &__link {
    min-width: 0;
    width: fit-content;
    justify-content: center;
  }
}
</style>
