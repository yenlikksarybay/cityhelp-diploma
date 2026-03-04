<template>
  <div class="auth">
    <div class="auth__wrapper">
      <UiLogo class="auth__logo" />

      <transition name="slide-down" mode="out-in">
        <TheAuthLogin v-if="route.query?.auth === 'login'" />
        <TheAuthRegister v-else-if="route.query?.auth === 'register'" />
      </transition>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const tabs = [
  {
    id: 1,
    name: "Логин",
    value: "login",
  },
  {
    id: 2,
    name: "Регистрация",
    value: "register",
  },
];

const oneTab = ref(tabs[0]);
</script>

<style lang="scss" scoped>
.auth {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    overflow: hidden;
  }
  &__logo {
    margin: 0 auto;
  }
}
</style>
