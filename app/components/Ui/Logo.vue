<template>
  <div class="logo">
    <div class="logo__wrapper">
      <NuxtImg
        v-if="type === 'logo'"
        src="/assets/images/logo/logo.png"
        alt="CityHelp"
        class="logo__preview"
        :style="{ width: width }"
        preload
        loading="lazy"
      />
      <p v-else class="logo__text">
        <span class="logo__baige">City</span> Help
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  width: String,
  type: {
    type: String,
    default: "logo",
  },
});
</script>

<style lang="scss" scoped>
.logo {
  &__wrapper {
    width: 100%;
    height: 100%;
  }
  &__preview {
    width: 50px;
  }
  &__text {
    font-size: 26px;
    font-weight: 700;
    color: $black;
  }
  &__baige {
    // color: $blue-500;
  }
}

@media (max-width: 768px) {
  .logo {
    &__text {
      font-size: 20px;
    }
  }
}
</style>
