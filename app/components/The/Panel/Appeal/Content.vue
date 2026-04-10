<template>
  <div class="content">
    <div class="content__wrapper">
      <div class="content__comment">
        <h3 class="content__title title-md title-point">Комментарий</h3>
        <p class="content__description">{{ appeal?.description || "—" }}</p>
      </div>

      <div class="content__images">
        <h3 class="content__title title-md title-point">Изображения</h3>
        <UiSwiper v-if="appeal?.photos?.length">
          <swiper-slide v-for="item in appeal.photos" :key="item.url">
            <img class="content__image" :src="item.url" :alt="item.name || 'Photo'" />
          </swiper-slide>
        </UiSwiper>
        <div v-else class="content__empty">
          <UiLoadImage />
        </div>
      </div>

      <div v-if="appeal?.fixedImages?.length" class="content__images">
        <h3 class="content__title title-md title-point">Фото результата</h3>
        <UiSwiper>
          <swiper-slide v-for="item in appeal.fixedImages" :key="item.url">
            <img class="content__image" :src="item.url" :alt="item.name || 'Result photo'" />
          </swiper-slide>
        </UiSwiper>
      </div>

      <section class="content__map">
        <h3 class="content__title title-md title-point">Место на карте</h3>
        <UiMap
          v-if="appeal?.location"
          class="content__location"
          :x="appeal.location.x"
          :y="appeal.location.y"
        />
      </section>

      <section v-if="appeal?.fixedLocation" class="content__map">
        <h3 class="content__title title-md title-point">Место после выполнения</h3>
        <UiMap
          class="content__location"
          :x="appeal.fixedLocation.x"
          :y="appeal.fixedLocation.y"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
defineProps({
  appeal: {
    type: Object,
    default: null,
  },
});
</script>

<style lang="scss" scoped>
.content {
  &__wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: $gap-xl;
  }
  &__map,
  &__images,
  &__comment {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__image {
    width: 100%;
    height: 500px;
    background-color: $surface-100;
    border-radius: $border-r-md;
    object-fit: cover;
  }
  &__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    background-color: $surface-100;
    border-radius: $border-r-md;
  }
  &__location {
    // max-height: 250px;
  }
  &__slide {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: auto;
  }
  &__description {
    font-weight: 500;
    line-height: 130%;
  }
}
</style>
