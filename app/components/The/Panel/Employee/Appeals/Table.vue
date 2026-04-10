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
              {{ "Приоритет" }}
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
        <tbody class="table__body" v-if="rows.length">
          <tr class="table__row" v-for="row in rows" :key="row.id">
            <td class="table__cell table__cell--first">
              {{ row.description }}
            </td>
            <td class="table__cell">
              <button
                v-if="row.photos?.length"
                type="button"
                class="table__preview-btn"
                @click="openPreview(row)"
              >
                <img
                  class="table__preview"
                  :src="row.photos[0].url"
                  :alt="row.description || 'Изображение обращения'"
                />
              </button>
              <UiIcon v-else icon="close" />
            </td>
            <td class="table__cell">
              <p>{{ row.category }}</p>
            </td>
            <td class="table__cell">
              <UiStatusText :status="normalizeUiStatus(row.priority)" :text="priorityText(row.priority)" />
            </td>
            <td class="table__cell">
              {{ formatDateToDots(row.deadlineAt) || "?" }}
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
                label="Детально"
                class="secondary-btn"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <UiModal :is-open="isOpenPreview" max-width="750px" @close="closePreview" :borderless="true">
    <ModalsPreviewImage :images="previewImages" />
  </UiModal>
</template>

<script setup>
const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
});

const isOpenPreview = ref(false);
const previewImages = ref([]);

const openPreview = (row) => {
  previewImages.value = (row?.photos || [])
    .map((photo) => photo?.url)
    .filter(Boolean);
  isOpenPreview.value = true;
};

const closePreview = () => {
  isOpenPreview.value = false;
  previewImages.value = [];
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
  &__preview {
    width: 100px;
    border-radius: $border-r-md;
    cursor: pointer;
  }
  &__preview-btn {
    display: inline-flex;
    padding: 0;
    border: 0;
    background: transparent;
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
      background-color: $surface-150 !important;
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
