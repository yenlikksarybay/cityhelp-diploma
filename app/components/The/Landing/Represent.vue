<template>
  <section class="represent">
    <div class="represent__wrapper">
      <div class="represent__grid">
        <div class="represent__left" data-aos="fade-up" data-aos-delay="100">
          <h2 class="represent__eyebrow">Что такое</h2>
          <h1 class="represent__title">
            <span class="represent__accent represent__accent--mobile">
              CityHe<span class="represent__accent">lp?</span>
            </span>
          </h1>
        </div>

        <div
          class="represent__media"
          aria-hidden="true"
          data-aos="zoom-in"
          data-aos-delay="150"
        ></div>

        <div class="represent__right" data-aos="fade-up" data-aos-delay="200">
          <h2 class="represent__eyebrow">
            <span class="represent__accent represent__accent--mobile"
              >Что мы</span
            >
          </h2>
          <h1 class="represent__title represent__title--right">
            <span class="represent__accent">Де</span>лаем?
          </h1>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.represent {
  background-color: $secondary-accent;
  &__wrapper {
    max-width: 1024px;
    width: 100%;
    margin: 60px auto;
    color: $tertiary-accent;
    padding: $padding-xxl 0;
    position: relative;
  }

  &__header {
    font-size: 16px;
    line-height: 140%;
    opacity: 0.9;
    margin-bottom: 32px;
  }

  &__accent {
    color: $secondary-accent;
    &--mobile {
      color: $tertiary-accent;
    }
  }

  &__grid {
    max-width: 90%;
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.1fr 1.8fr 1fr;
    // gap: 24px;
    align-items: start;
  }

  &__left {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 12px;
    position: relative;
    z-index: 2;
  }

  &__right {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 12px;
    text-align: right;
    position: relative;
    align-self: end;
    z-index: 2;
    bottom: 10px;
  }

  &__eyebrow {
    font-size: 38px;
    line-height: 120%;
    font-weight: 400;
    opacity: 0.9;
    font-family: "Lato", sans-serif;
  }

  &__title {
    font-family: "Lato", sans-serif;
    font-size: 64px;
    line-height: 100%;
    font-weight: 700;
    letter-spacing: 0px;
  }

  &__title--right {
    font-weight: 800;
  }

  &__media {
    width: 145%;
    transform: translateX(-15%) !important;
    height: 400px;
    aspect-ratio: 4 / 3;
    border-radius: 20px;
    margin: 0 auto;
    background: $tertiary-accent;
    box-shadow:
      0 16px 40px rgba(0, 0, 0, 0.18),
      inset 0 0 0 1px rgba(255, 255, 255, 0.35);
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  @media (max-width: 1024px) {
    &__wrapper {
      margin: 0;
    }
    &__grid {
      grid-template-columns: 1fr;
      text-align: left;
      gap: $gap-xxl;
    }

    &__left {
      margin-bottom: -80px;
      margin-left: 10px;
    }

    &__right {
      align-self: start;
      text-align: right;
      margin-top: -60px;
      margin-right: 10px;
    }

    &__accent {
      color: $tertiary-accent;
      &--mobile {
        color: $primary-accent;
      }
      & > .represent__accent {
        color: $primary-accent;
      }
    }

    &__media {
      width: 100%;
      transform: translateX(0%) !important;
    }
  }

  @media (max-width: 640px) {
    &__wrapper {
      padding: $padding-xl;
    }

    &__title {
      font-size: 44px;
    }
  }
}
</style>
