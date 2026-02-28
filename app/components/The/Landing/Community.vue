<template>
  <section class="community">
    <div class="community__wrapper">
      <div class="community__content">
        <p class="community__kicker">Сообщество CityHelp</p>
        <h3 class="community__title">Присоединяйся к нашей комьюнити</h3>
        <p class="community__description">
          Обсуждаем городские инициативы, делимся кейсами и обновлениями
          платформы. Подключайся и участвуй в улучшении своего района.
        </p>
        <div class="community__actions">
          <span class="community__pill">Новости</span>
          <span class="community__pill">Обратная связь</span>
          <span class="community__pill">Инициативы</span>
        </div>
      </div>
      <div class="community__qr-wrap" data-aos="zoom-in" data-aos-delay="150">
        <img
          class="community__qr"
          src="/assets/images/landing/QR-CityHelp.png"
          alt="QR-код CityHelp"
        />
        <p class="community__qr-text">Сканируй и присоединяйся</p>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.community {
  background-color: $secondary-accent;
  padding: $padding-xxl;
  &__wrapper {
    background-color: $tertiary-accent;
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
    border-radius: 20px;

    color: $secondary-accent;
    padding: $padding-xxl;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 32px;
    align-items: center;
  }

  &__content {
    display: grid;
    gap: 16px;
  }

  &__kicker {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
  }

  &__title {
    font-family: "SF Pro Rounded", "Lato", sans-serif;
    font-size: 32px;
    line-height: 120%;
    font-weight: 700;
  }

  &__description {
    font-size: 16px;
    line-height: 160%;
    color: $primary-accent;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__pill {
    background: rgba(254, 250, 224, 0.18);
    background-color: $secondary-accent;
    color: $white;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
  }

  &__qr-wrap {
    // background: rgba(254, 250, 224, 0.12);
    border-radius: 22px;
    padding: 20px;
    display: grid;
    justify-items: center;
    gap: 12px;
    border: 1px solid rgba(254, 250, 224, 0.25);
  }

  &__qr {
    width: 220px;
    max-width: 100%;
    height: auto;
    border-radius: 14px;
    background: $primary-accent;
    padding: 10px;
  }

  &__qr-text {
    font-size: 14px;
    color: $secondary-accent;
  }

  @media (max-width: 900px) {
    &__wrapper {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    &__wrapper {
      padding: $padding-xl;
    }

    &__title {
      font-size: 26px;
    }

    &__qr {
      width: 180px;
    }
  }
}
</style>
