<template>
  <div class="content">
    <div class="content__wrapper">
      <div class="content__comment">
        <h3 class="content__title title-md title-point">Комментарий</h3>
        <p class="content__description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
          quibusdam vero, provident obcaecati amet veritatis! Aspernatur illum
          tempora sit eligendi ut maiores dignissimos ipsam velit! Consequatur
          consequuntur sit, accusantium nulla architecto praesentium animi,
          maiores laboriosam quo nam laudantium tenetur asperiores ex debitis
          cum optio enim et corporis commodi voluptatibus ratione.
        </p>
      </div>

      <div class="content__images">
        <h3 class="content__title title-md title-point">Изображения</h3>
        <UiSwiper
          :loop="false"
          :pagination="true"
          prev-btn-class=".preview__arrow--prev"
          next-btn-class=".preview__arrow--next"
        >
          <swiper-slide v-for="item in 5" :key="item">
            <img v-if="false" class="content__image" src="" alt="Photo" />
            <div class="content__image"><UiLoadImage /></div>
          </swiper-slide>
          <swiper-slide class="content__slide">
            <UiComminutyQR />
          </swiper-slide>
        </UiSwiper>
      </div>

      <section class="content__map">
        <h3 class="content__title title-md title-point">Место на карте</h3>
        <UiMap class="content__location" />
      </section>
    </div>
  </div>
</template>

<script setup></script>

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
