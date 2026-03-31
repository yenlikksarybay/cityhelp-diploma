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
      <UiHeatmap :points="heatmapPoints" />

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

const heatmapPoints = [
  [43.238949, 76.889709],
  [43.238949, 76.889709],
  [43.23925, 76.8911],
  [43.2398, 76.8922],
  [43.2402, 76.8931],
  [43.2402, 76.8931],
  [43.241, 76.8919],
  [43.2424, 76.895],
  [43.2442, 76.8991],
  [43.2451, 76.9015],
  [43.2299, 76.8784],
  [43.2304, 76.8793],
  [43.2311, 76.8805],
  [43.232, 76.8817],
  [43.2334, 76.8831],
  [43.2334, 76.8831],
  [43.2501, 76.9284],
  [43.2507, 76.9294],
  [43.2512, 76.9302],
  [43.252, 76.9316],
  [43.2531, 76.9324],
  [43.2531, 76.9324],
  [43.2168, 76.8482],
  [43.2174, 76.8493],
  [43.2182, 76.8501],
  [43.2191, 76.8512],
  [43.2205, 76.8526],
  [43.2205, 76.8526],
  [43.2744, 76.9408],
  [43.2751, 76.9419],
  [43.2762, 76.9432],
  [43.2771, 76.9444],
  [43.278, 76.9456],
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
