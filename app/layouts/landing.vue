<template>
  <div class="landing">
    <div class="landing__wrapper">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.landing {
  &__wrapper {
    width: 100%;
    margin: 0px auto;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 640px) {
    &__wrapper {
      gap: $gap-xl;
    }
  }
}
</style>
