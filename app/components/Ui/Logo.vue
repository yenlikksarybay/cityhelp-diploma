<template>
  <div class="logo">
    <div
      class="logo__wrapper"
      :class="{ 'logo__wrapper--horizontal': type === 'horizontal' }"
    >
      <NuxtImg
        src="/assets/images/logo/logo.svg"
        alt="CityHelp"
        class="logo__preview"
        :style="{ width: width }"
        preload
        loading="lazy"
      />
      <p class="logo__text"><span class="logo__baige">City</span> Help</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  width: String,
  type: {
    type: String,
    default: "vertical",
  },
});
</script>

<style lang="scss" scoped>
.logo {
  &__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: $gap-md;
    &--horizontal {
      flex-direction: column;
    }
  }
  &__preview {
    width: 40px;
  }
  &__text {
    font-size: 26px;
    font-weight: 700;
    color: $black;
  }
  &__baige {
    // color: $secondary-accent;
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
