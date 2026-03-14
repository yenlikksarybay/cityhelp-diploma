<template>
  <section class="about">
    <div class="about__wrapper">
      <UiLogo width="150px" type="horizontal" />

      <div class="about__box">
        <h2 class="about__title title-md title-point">История</h2>
        <p class="about__text">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis
          dolorum ipsum cumque ut adipisci. Corrupti quibusdam assumenda
          asperiores. Voluptate minima, tempora quod iure aperiam assumenda
          blanditiis libero exercitationem asperiores atque omnis eos sit.
          Aliquam a numquam qui facere eaque iste modi minima amet suscipit nemo
          repellat nisi adipisci, reiciendis fugiat.
        </p>
      </div>

      <div class="about__box">
        <h2 class="about__title about__title--center title-md title-point">
          Наша миссия
        </h2>
        <p class="about__text about__text--center">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis
          dolorum ipsum cumque ut adipisci. Corrupti quibusdam assumenda
          asperiores. Voluptate minima, tempora quod iure aperiam assumenda
          blanditiis libero exercitationem asperiores atque omnis eos sit.
          Aliquam a numquam qui facere eaque iste modi minima amet suscipit nemo
          repellat nisi adipisci, reiciendis fugiat.
        </p>
      </div>

      <div class="about__box">
        <h2 class="about__title about__title--right title-md title-point">
          Цифры о нас
        </h2>
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

const info = [
  {
    name: "Колличество общих обращений",
    number: "1490",
    bgColor: "yellow-400",
    color: "white",
  },
  {
    name: "Колличество пользователей",
    number: "709",
    bgColor: "green-400",
    color: "white",
  },
  {
    name: "Колличество сотрудников",
    number: "145",
    bgColor: "red-300",
    color: "white",
  },
];
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
