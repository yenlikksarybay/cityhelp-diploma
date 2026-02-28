<template>
  <section class="help-us" data-help-section>
    <div class="help-us__wrapper" data-aos="fade-up">
      <p class="help-us__kicker">Начать сейчас</p>
      <h2 class="help-us__title">Сделайте ваш город лучше сегодня</h2>
      <p class="help-us__subtitle">
        Регистрация занимает 30 секунд. Первое обращение — бесплатно и без
        лишних документов.
      </p>
      <div class="help-us__actions">
        <UiButton class="help-us__btn tertiary-btn" label="Создать обращение" />
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.help-us {
  background-color: $secondary-accent;
  // border-bottom-left-radius: 28px;
  // border-bottom-right-radius: 28px;

  &__wrapper {
    max-width: 1024px;
    margin: 0 auto;
    padding: $padding-xxl;
    text-align: center;
    display: grid;
    gap: 18px;
    color: $primary-accent;
    border-radius: 28px;
  }

  &__kicker {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    color: $tertiary-accent;
  }

  &__title {
    font-family: "SF Pro Rounded", "Lato", sans-serif;
    font-size: 36px;
    line-height: 120%;
    font-weight: 700;
    color: $tertiary-accent;
  }

  &__subtitle {
    font-size: 16px;
    line-height: 160%;
    color: $tertiary-accent;
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 8px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    &__wrapper {
      padding: $padding-xl;
    }

    &__title {
      font-size: 28px;
    }

    &__btn {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
