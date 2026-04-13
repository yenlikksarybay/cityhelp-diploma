<template>
  <section class="about">
    <div class="about__wrapper">
      <UiLogo width="150px" type="horizontal" />

      <div class="about__box">
        <h2 class="about__title title-md title-point">История</h2>
        <p class="about__text">
          {{ about.history }}
        </p>
      </div>

      <div class="about__box">
        <h2 class="about__title about__title--center title-md title-point">
          Наша миссия
        </h2>
        <p class="about__text about__text--center">
          {{ about.mission }}
        </p>
      </div>

      <div class="about__box">
        <h2 class="about__title about__title--right title-md title-point">
          Цифры о нас
        </h2>
        <div class="about__values">
          <span v-for="value in about.values" :key="value" class="about__value">
            {{ value }}
          </span>
        </div>
        <div
          class="about__cards"
          :class="{ 'about__cards--aside': !asideStore.isOpen }"
        >
          <TheAboutUsCard v-for="card in info" :key="card.name" :card="card" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const asideStore = useAsideStore();

useSeo({ title: "О 'City Help'" });

const about = ref({
  history: "",
  mission: "",
  values: [],
  stats: {},
});

const info = computed(() => [
  {
    name: "Колличество общих обращений",
    number: String(about.value.stats.totalAppeals || 0),
    bgColor: "yellow-400",
    color: "white",
  },
  {
    name: "Колличество пользователей",
    number: String(about.value.stats.totalUsers || 0),
    bgColor: "green-400",
    color: "white",
  },
  {
    name: "Колличество сотрудников",
    number: String(about.value.stats.totalEmployees || 0),
    bgColor: "red-300",
    color: "white",
  },
]);

const loadAbout = async () => {
  const response = await useFetchSsr({
    url: "/about-us",
    method: "get",
  });

  const data = response?.data || response || {};
  about.value = {
    history: data.history || "",
    mission: data.mission || "",
    values: Array.isArray(data.values) ? data.values : [],
    stats: data.stats || {},
  };
};

await loadAbout();
</script>

<style lang="scss" scoped>
.about {
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
  &__title {
    &--center {
      text-align: center;
      width: fit-content;
      margin: 0 auto;
    }
    &--right {
      width: fit-content;
      margin-left: auto;
    }
  }
  &__box {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__values {
    display: flex;
    flex-wrap: wrap;
    gap: $gap-sm;
  }
  &__value {
    padding: 8px 12px;
    border-radius: 999px;
    background-color: $surface-100;
    color: $surface-600;
    box-shadow: $box-shadow;
    font-weight: 500;
  }
  &__text {
    line-height: 120%;
    font-weight: 500;
  }
}

@media (max-width: 1024px) {
  .about {
    &__cards {
      &--aside {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
}

@media (max-width: 768px) {
  .about {
    &__cards {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
