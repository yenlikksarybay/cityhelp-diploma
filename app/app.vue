<template>
  <div class="app">
    <div class="app__wrapper">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>

      <UiNotify />

      <UiLoader />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.app {
  &__wrapper {
  }
}
</style>
