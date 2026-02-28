<template>
  <header class="header">
    <div class="header__wrapper">
      <UiLogo />

      <nav class="header__nav">
        <ul class="header__ul">
          <li class="header__li" v-for="item in nav" :key="item.nav">
            <nuxt-link class="header__link" :to="item.link">
              <p class="header__text">{{ item.name }}</p>
            </nuxt-link>
          </li>
          <li class="header__li header__li--btn">
            <UiButton label="Отправить снимок" class="primary-btn" />
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
const nav = [
  {
    name: "Как это работает?",
    link: "#how-it-works",
  },
  {
    name: "AI",
    link: "#ai",
  },
  {
    name: "Цифры о нас",
    link: "#digits",
  },
  {
    name: "Сообщества",
    link: "#community",
  },
];
</script>

<style lang="scss" scoped>
.header {
  &__wrapper {
    display: flex;
    justify-content: space-between;
    padding: $padding-md;
    border-bottom: 1px solid $surface-150;
    align-items: center;
  }
  &__ul {
    display: flex;
    gap: 30px;
    align-items: center;
  }
  &__li {
    &--btn {
      margin-left: 24px;
    }
  }
  &__text {
    color: $surface-400;
    font-weight: 500;
    transition: 0.3s ease;
    &:hover {
      color: $surface-600;
    }
  }
}

@media (max-width: 768px) {
  .header {
    &__li {
      display: none;
      &--btn {
        display: block;
      }
    }
  }
}
</style>
