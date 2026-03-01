<template>
  <section class="stages">
    <div class="stages__wrapper">
      <div class="stages__header" data-aos="fade-up">
        <h2 class="stages__title">Какие этапы у CityHelp?</h2>
        <p class="stages__subtitle">
          Процесс цикличный и состоит из трех понятных шагов — от фиксации
          проблемы до ее решения ответственными службами.
        </p>
      </div>

      <div class="stages__items">
        <div class="stages__item" data-aos="fade-up" data-aos-delay="100">
          <div class="stages__content">
            <div class="stages__badge">1</div>
            <h3 class="stages__item-title">Snap — Зафиксировать</h3>
            <p class="stages__item-text">
              Увидели проблему? Сделайте фото и добавьте краткое описание —
              заявка будет создана за минуту.
            </p>
          </div>
          <img
            class="stages__media stages__media--one"
            src="/assets/images/landing/Snap_1.webp"
            alt="Span"
            aria-hidden="true"
          />
        </div>

        <div
          class="stages__item stages__item--reverse"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <img
            class="stages__media stages__media--two"
            src="/assets/images/landing/Send_2.webp"
            alt="Span"
            aria-hidden="true"
          />
          <div class="stages__content">
            <div class="stages__badge">2</div>
            <h3 class="stages__item-title">Send — Отправить</h3>
            <p class="stages__item-text">
              Отправьте обращение на месте — без длинных форм, звонков и
              ожидания.
            </p>
          </div>
        </div>

        <div class="stages__item" data-aos="fade-up" data-aos-delay="200">
          <div class="stages__content">
            <div class="stages__badge">3</div>
            <h3 class="stages__item-title">Solve — Решить</h3>
            <p class="stages__item-text">
              Мы направим заявку ответственным службам, чтобы они рассмотрели ее
              и приступили к решению.
            </p>
          </div>
          <img
            class="stages__media stages__media--three"
            src="/assets/images/landing/Solve_3.webp"
            alt="Span"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.stages {
  background-color: $secondary-accent;
  &__wrapper {
    color: $tertiary-accent;
    padding: $padding-xxl;
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
  }

  &__header {
    max-width: 720px;
    display: grid;
    gap: 16px;
    margin-bottom: 40px;
  }

  &__title {
    font-family: "SF Pro Rounded", "Lato", sans-serif;
    font-size: 42px;
    line-height: 120%;
    font-weight: 700;
  }

  &__subtitle {
    font-size: 16px;
    line-height: 160%;
    color: rgba(254, 250, 224, 0.85);
  }

  &__items {
    display: grid;
    gap: 28px;
  }

  &__item {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    align-items: center;
    gap: 28px;
  }

  &__item--reverse {
    grid-template-columns: 1fr 1.1fr;
  }

  &__content {
    display: grid;
    gap: 12px;
    max-width: 520px;
  }

  &__badge {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background-color: $tertiary-accent;
    color: $primary-accent;
    display: grid;
    place-items: center;
    font-weight: 700;
  }

  &__item-title {
    font-size: 22px;
    font-weight: 700;
  }

  &__item-text {
    font-size: 16px;
    line-height: 150%;
    color: rgba(254, 250, 224, 0.85);
  }

  &__media {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 22px;
    background: linear-gradient(
      140deg,
      rgba(254, 250, 224, 0.2),
      rgba(254, 250, 224, 0.05)
    );
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
  }

  &__media::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 20% 30%,
        rgba(254, 250, 224, 0.4),
        transparent 55%
      ),
      radial-gradient(
        circle at 70% 60%,
        rgba(254, 250, 224, 0.25),
        transparent 45%
      );
    opacity: 0.7;
  }

  &__media--one {
    background-color: rgba(254, 250, 224, 0.12);
  }

  &__media--two {
    background-color: rgba(254, 250, 224, 0.18);
  }

  &__media--three {
    background-color: rgba(254, 250, 224, 0.1);
  }

  @media (max-width: 1024px) {
    &__item,
    &__item--reverse {
      grid-template-columns: 1fr;
    }

    &__media {
      order: 2;
    }
  }

  @media (max-width: 640px) {
    &__wrapper {
      padding: $padding-xl;
    }

    &__title {
      font-size: 32px;
    }

    &__item-title {
      font-size: 20px;
    }
  }
}
</style>
