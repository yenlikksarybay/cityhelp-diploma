<template>
  <section class="card">
    <nuxt-link to="" class="card__wrapper">
      <UiLoadImage class="card__image" />

      <div class="card__content">
        <h4 class="card__title title-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
          fugiat?
        </h4>
        <ul class="card__ul">
          <li class="card__li" v-for="list in lists" :key="list.id">
            <UiIcon :icon="list.icon" size="size-20" />
            <p class="card__li-text">
              {{ list.name }}
            </p>
          </li>
        </ul>
      </div>
    </nuxt-link>
  </section>
</template>

<script setup>
const lists = [
  {
    id: 1,
    name: "Назарбаева 22a",
    icon: "location-i",
  },
  {
    id: 1,
    name: "Высокий проритет",
    icon: "status-i",
  },
];
</script>

<style lang="scss" scoped>
.card {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    background-color: $surface-150;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
    border: 2px solid transparent;
    transition: 0.4s ease;

    &:hover {
      border: 2px solid $secondary-accent;
      box-shadow: $box-shadow-md;
    }
  }
  &__content {
    padding: $padding-md;
  }
  &__image {
    height: 120;
  }
  &__ul {
    display: flex;
    flex-wrap: wrap;
    gap: $gap-xl;
  }
  &__li {
    display: flex;
    align-items: center;
    gap: $gap-sm;
    &-text {
      font-size: 14px;
      color: $surface-400;
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
  }
}
</style>
