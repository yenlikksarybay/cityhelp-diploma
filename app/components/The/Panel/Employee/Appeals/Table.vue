<template>
  <div class="table">
    <div class="table__wrapper">
      <table class="table__table">
        <thead class="table__head">
          <tr class="table__row">
            <th class="table__cell table__cell--head">{{ "Описание" }}</th>
            <th class="table__cell table__cell--head">{{ "Изображение" }}</th>
            <th class="table__cell table__cell--head">
              {{ "Категория" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Проритет" }}
            </th>
            <th class="table__cell table__cell--head">
              {{ "Дедлайн" }}
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
        <tbody class="table__body" v-if="students.length">
          <tr class="table__row" v-for="(row, index) in students" :key="row.id">
            <td class="table__cell table__cell--first">
              {{ row.description }}
            </td>
            <td class="table__cell">
              <div v-if="row.preview || true">
                <img
                  @click="openPreview"
                  class="table__preview"
                  src="https://yastatic.net/naydex/yandex-search/1TLRG7322/ead043Sb/t-dsrVqNqNlf6m5zwI3gdIyq4T98ht7zek4YO9BdzZzz8Qkx8cGPwbHHBd0wKbmmGdNabzukPUavS8uts-AgKnfmGSxeSdyYqn9qwgXNYETcizTrTZcbUz-fvB4V3O08c7FpglIGmPancHbf9x4uMm03DpveNI1Ta9ouOYADw"
                  alt="Preview"
                />
              </div>
              <UiIcon v-else icon="close" />
            </td>
            <td class="table__cell">
              <p>{{ row.category }}</p>
            </td>
            <td class="table__cell">
              <UiStatusText status="rejected" :text="row.priority" />
            </td>
            <td class="table__cell">
              {{ row.deadline }}
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
            <td class="table__cell">
              <UiButton
                tag="a"
                :href="`/panel/appeal/1`"
                label="Детально"
                class="secondary-btn"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <UiModal
    :is-open="isOpenPreview"
    max-width="750px"
    @close="closePreview"
    :borderless="true"
  >
    <ModalsPreviewImage
      :images="[
        'https://yastatic.net/naydex/yandex-search/1TLRG7322/ead043Sb/t-dsrVqNqNlf6m5zwI3gdIyq4T98ht7zek4YO9BdzZzz8Qkx8cGPwbHHBd0wKbmmGdNabzukPUavS8uts-AgKnfmGSxeSdyYqn9qwgXNYETcizTrTZcbUz-fvB4V3O08c7FpglIGmPancHbf9x4uMm03DpveNI1Ta9ouOYADw',
        'https://yastatic.net/naydex/yandex-search/1TLRG7423/ead043Sb/t-dsrVqNqNlf6m5zwI3gdIyq4T98ht7zek4YO9B4zZyzEVnENHGq8bHC4GjgCen2CTZvChsUWCMPa1sNU9BVH1KmKSkeSZzoqm86YkQpIAQc6xWOqAbagr9uqUplHTmJJoGppJIHePaWoXcOR_7OQf03Cw6vtH3zeg9KaJJTw5',
      ]"
    />
  </UiModal>
</template>

<script setup>
const isOpenPreview = ref(null);
const openPreview = () => {
  isOpenPreview.value = true;
};

const closePreview = () => {
  isOpenPreview.value = false;
};

const students = [
  {
    description: "Надо чинить дорогу",
    category: "Починить",
    priority: "Низкая",
    deadline: "24.3.2026",
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
  &__preview {
    width: 100px;
    border-radius: $border-r-md;
    cursor: pointer;
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
    &--first {
      min-width: 200px;
    }
    &--head {
      background-color: $surface-150;
      padding: $padding-md;
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
