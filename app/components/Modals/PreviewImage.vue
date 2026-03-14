<template>
  <div class="preview">
    <div class="preview__wrapper">
      <div class="preview__box">
        <UiSwiper
          :loop="false"
          :pagination="true"
          prev-btn-class=".preview__arrow--prev"
          next-btn-class=".preview__arrow--next"
        >
          <swiper-slide
            class="preview__slide"
            v-for="image in images"
            :key="image"
          >
            <img class="preview__image" :src="image" alt="Preview" />
          </swiper-slide>
        </UiSwiper>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  images: Array,
});
</script>

<style lang="scss" scoped>
.preview {
  &__wrapper {
  }
  &__slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__box {
    position: relative;
  }
  &__image {
    border-radius: $border-r-md;
  }
}
</style>
