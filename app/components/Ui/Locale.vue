<template>
  <div class="lang" @click="switchLang()">
    <div class="lang__wrapper">
      <transition name="slide-down">
        <div
          class="lang__info"
          :class="{ 'lang__info--ru': currentLang.code === 'ru' }"
          v-if="currentLang"
          :key="currentLang.code"
        >
          <img
            class="lang__flag"
            :src="currentLang.flag || 'Flag'"
            :alt="currentLang.name"
          />
          <p class="lang__text">
            {{ currentLang.name }}
          </p>
        </div>
      </transition>
      <UiIcon class="lang__icon" icon="chevron" deg="left" size="size-12" />
    </div>
  </div>
</template>

<script setup>
const { locale, locales, setLocale, t } = useI18n();

const currentIndex = ref(0);

const currentLang = computed(() =>
  locales.value?.find((item) => item.code === locale.value),
);

const switchLang = () => {
  currentIndex.value = (currentIndex.value + 1) % locales.value.length;
  setLocale(locales.value[currentIndex.value].code);
};
</script>

<style lang="scss" scoped>
.lang {
  cursor: pointer;
  &__wrapper {
    display: flex;
    gap: $gap-xxs;
    align-items: center;
    position: relative;
    width: 100px;
    justify-content: flex-end;
  }
  &__info {
    display: flex;
    gap: $gap-xxs;
    align-items: center;
    position: absolute;
    left: 3px;
    // &--ru {
    //   left: 3px;
    // }
  }
  &__flag {
    width: 20px;
    height: auto;
  }
  &__text {
    font-weight: 500;
    font-size: 14px;
  }
}
</style>
