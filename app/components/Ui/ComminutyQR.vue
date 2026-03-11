<template>
  <div class="community">
    <div class="community__wrapper">
      <p class="community__description">
        Есть вопросы? <br />
        Тогда перейдите в сообщество "CityHelp"
      </p>
      <div class="community__qr-wrap" data-aos="zoom-in" data-aos-delay="150">
        <img
          class="community__qr"
          src="/assets/images/landing/QR-CityHelp.png"
          alt="QR-код CityHelp"
        />
        <p class="community__qr-text">Сканируй и присоединяйся</p>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.community {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__description {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: $secondary-accent;
  }
  &__qr {
    max-width: 300px;
    &-wrap {
      text-align: center;
    }
    &-text {
      color: $surface-300;
      font-weight: 500;
      font-size: 12px;
    }
  }
}
</style>
