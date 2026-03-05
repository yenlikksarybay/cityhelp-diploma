<template>
  <client-only>
    <swiper class="custom-swiper">
      <swiper-container
        :space-between="gap"
        :slides-per-view="perSlides"
        :looped-slides="loopedSlides"
        :loop="loop"
        :initial-slide="initialSlide"
        :centered-slides="centeredSlides"
        :modules="modules"
        :speed="800"
        :navigation="{
          nextEl: nextBtnClass,
          prevEl: prevBtnClass,
        }"
        :breakpoints="breakpoints"
        :autoplay="autoplay"
        :slides-offset-after="slidesOffsetAfter"
        :slides-offset-before="slidesOffsetBefore"
        :centerInsufficientSlides="true"
        :pagination="pagination"
      >
        <slot></slot>
      </swiper-container>
    </swiper>
  </client-only>
</template>

<script setup>
import { Swiper } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";
const modules = [Autoplay, Navigation];

const props = defineProps({
  autoplay: {
    type: [Boolean, Object],
    default: false,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  perSlides: {
    type: [String, Number],
    default: 1,
  },
  grid: {
    type: Object,
    default: { rows: 1 },
  },
  gap: {
    type: Number,
    default: 12,
  },
  nextBtnClass: {
    type: String,
    default: "",
  },
  prevBtnClass: {
    type: String,
    default: "",
  },
  breakpoints: {
    type: Object,
    default: {
      768: {},
      992: {},
    },
  },
  centeredSlides: {
    type: Boolean,
    default: false,
  },
  initialSlide: {
    type: Number,
    default: 0,
  },
  pagination: {
    type: [Boolean, Object],
    default: true,
  },
  loopedSlides: Number,
  slidesOffsetAfter: Number,
  slidesOffsetBefore: Number,
});
</script>

<style lang="scss" scoped>
.custom-swiper::part(pagination) {
  position: relative;
  margin-top: 25px;
}

.custom-swiper::part(button-prev) {
  display: none !important;
}
.custom-swiper::part(button-next) {
  display: none !important;
}
.custom-swiper:deep(::part(bullet-active)) {
  background-color: $white !important;
  width: 12px;
  height: 12px;
}
</style>
