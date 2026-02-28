<template>
  <section class="introduce" data-aos="fade-up">
    <div class="introduce__wrapper">
      <div class="introduce__scene">
        <img
          class="introduce__decor"
          src="/assets/images/landing/decor.webp"
          alt="Decor"
        />
        <div class="introduce__logo"><p>Logo</p></div>
        <div class="introduce__word" aria-hidden="true">CITYHELP</div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.introduce {
  &__wrapper {
    min-height: 100vh;
    background: linear-gradient(180deg, $tertiary-accent 0%, #e9edd8 100%);
    overflow: hidden;
    position: relative;
  }

  &__scene {
    position: relative;
    height: 100%;
    min-height: 100vh;
    // max-width: 1024px;
    margin: 0 auto;
    padding: $padding-xxl;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 40px;
    align-items: center;
  }

  &__decor {
    position: absolute;
    max-width: 480px;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    top: 0px;
    z-index: 2;
  }

  &__logo {
    max-width: 150px;
    width: 100%;
    height: 150px;
    background-color: $secondary-accent;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 165px;
    border-radius: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $white;
    font-size: 50px;
  }

  &__word {
    position: absolute;
    z-index: 1;
    // left: 50%;
    bottom: -22px;
    // transform: translateX(-50%);
    font-size: 280px;
    font-size: clamp(3.625rem, -0.339rem + 19.82vw, 17.5rem);
    font-weight: 800;
    letter-spacing: 0.06em;
    color: $secondary-accent;
    text-align: center;
    width: 100%;
    pointer-events: none;
    line-height: 0.9;
  }

  @media (max-width: 1400px) {
    .introduce {
    }
  }

  @media (max-width: 900px) {
    &__scene {
      grid-template-columns: 1fr;
      min-height: 100vh;
      padding: $padding-xl;
    }
    &__word {
      bottom: 0;
    }
  }
}
</style>
