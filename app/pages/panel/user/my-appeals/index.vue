<template>
  <section class="my-appeals">
    <div class="my-appeals__wrapper">
      <UiTabs :tabs="tabs" v-model="oneTab" :is-scroll="true" />
      <h2 class="my-appeals__title title-md">Обращений (12)</h2>

      <div class="my-appeals__cards">
        <ThePanelUserMyAppealsCard v-for="card in 12" :key="card" />
      </div>
    </div>
  </section>
</template>

<script setup>
useSeo({ title: "Мои обращений" });

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
.my-appeals {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $gap-md;
  }
}
</style>
