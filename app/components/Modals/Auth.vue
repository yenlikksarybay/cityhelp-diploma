<template>
  <div class="auth">
    <div class="auth__wrapper">
      <UiLogo type="horizontal" class="auth__logo" />

      <transition name="slide-down" mode="out-in">
        <TheAuthLogin v-if="route.query?.auth === 'login'" />
        <TheAuthRegister v-else-if="route.query?.auth === 'register'" />
      </transition>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
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
