<template>
  <section class="main">
    <div class="main__wrapper">
      <h2 class="main__title title-md">Общие данные</h2>
      <div
        class="main__boards"
        :class="{ 'main__boards--aside': !asideStore.isOpen }"
      >
        <ThePanelMainInfoBoard
          v-for="info in infoBoards"
          :key="info.id"
          :info="info"
        />
      </div>

      <h2 class="main__title title-md">Тепловая карта</h2>
      <ThePanelMainMap />

      <h3 class="main__title title-md">Все обращений (45)</h3>
      <div
        class="main__cards"
        :class="{ 'main__cards--aside': !asideStore.isOpen }"
      >
        <ThePanelMainCard v-for="card in 10" :key="card" />
      </div>
    </div>
  </section>
</template>

<script setup>
const asideStore = useAsideStore();
useSeo({ title: "Главная" });

const infoBoards = [
  {
    id: 1,
    name: "Общие колличество обращений",
    text: 1040,
    icon: "circle-i",
    iconColor: "blue-500",
    bgColor: "",
    textColor: "",
    borderColor: "#0646FF",
  },
  {
    id: 2,
    name: "Выполненные обращений",
    text: 345,
    icon: "checkmark-i",
    iconColor: "green-500",
    bgColor: "",
    textColor: "",
    borderColor: "#22C55E",
  },
  {
    id: 3,
    name: "Ожидающие обращений",
    text: 345,
    icon: "time-i",
    iconColor: "yellow-400",
    bgColor: "",
    textColor: "",
    borderColor: "#FFCC00",
  },
  {
    id: 4,
    name: "Отклоненные обращений",
    text: 1040,
    icon: "close",
    iconColor: "red-300",
    bgColor: "",
    textColor: "",
    borderColor: "#FF5757",
  },
];
</script>

<style lang="scss" scoped>
.main {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__boards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $gap-xl;
  }
  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $gap-xl;
  }
}

@media (max-width: 1200px) {
  .main {
    &__boards,
    &__cards {
      &--aside {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}

@media (max-width: 1000px) {
  .main {
    &__boards,
    &__cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 625px) {
  .main {
    &__boards,
    &__cards {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
