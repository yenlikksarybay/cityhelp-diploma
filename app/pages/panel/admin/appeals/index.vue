<template>
  <section class="appeals">
    <div class="appeals__wrapper">
      <UiTabs :tabs="tabs" v-model="oneTab" :is-scroll="true" />

      <div class="appeals__filter">
        <UiInput
          before-icon="lupa-i"
          icon-size="size-20"
          placeholder="Поиск по описанию"
          v-model="search"
        />
        <UiSelect
          placeholder="Проритет"
          :options="priorities"
          v-model="onePriority"
        />
      </div>

      <ThePanelAdminAppealsTable />
    </div>
  </section>
</template>

<script setup>
useSeo({ title: "Список обращений" });

const search = ref("");
const priorities = [
  {
    id: 1,
    name: "Высокий",
  },
  {
    id: 2,
    name: "Средний",
  },
  {
    id: 2,
    name: "Низкий",
  },
];
const onePriority = ref(priorities[0]);

const tabs = [
  {
    id: 1,
    value: "all",
    name: "Все",
    icon: "",
  },
  {
    id: 2,
    value: "solved",
    name: "Решеннные",
    icon: "checkmark-i",
  },
  {
    id: 3,
    value: "processing",
    name: "В процессе",
    icon: "time-i",
  },
  {
    id: 4,
    value: "rejected",
    name: "Отклоненные",
    icon: "close",
  },
];
const oneTab = ref(tabs[0]);
</script>

<style lang="scss" scoped>
.appeals {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__filter {
    display: flex;
    align-items: center;
    gap: $gap-md;
  }
}

@media (max-width: 625px) {
  .appeals {
    &__filter {
      flex-direction: column;
    }
    &__btn {
      width: 50%;
      margin-left: auto;
    }
  }
}
</style>
