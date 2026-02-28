<template>
  <section class="goals">
    <div class="goals__wrapper">
      <div class="goals__container">
        <div class="goals__intro" data-aos="fade-up">
          <h2 class="goals__headline">
            Что такое CityHelp и как это работает?
          </h2>
          <p class="goals__lead">
            CityHelp — интеллектуальная платформа для городских обращений. Мы
            собираем сообщения жителей, связываем их с ответственными службами и
            даем прозрачный путь от проблемы до решения.
          </p>
        </div>

        <div class="goals__grid">
          <div class="goals__card goals__card--media" data-aos="zoom-in">
            <div
              class="goals__media goals__media--square"
              aria-hidden="true"
            ></div>
            <p class="goals__text">
              Единое окно для обращений — без звонков и сложных форм.
            </p>
          </div>

          <div class="goals__card goals__card--wide" data-aos="fade-up">
            <h3 class="goals__block-title">Платформа ускоряет решения</h3>
            <p class="goals__text">
              Заявки сразу попадают в систему, получают статус и приоритет.
              Службы видят общую картину и работают быстрее.
            </p>
            <div class="goals__metrics">
              <div class="goals__metric">
                <span class="goals__metric-value">1</span>
                <span class="goals__metric-text"
                  >обращение = точка на карте</span
                >
              </div>
              <div class="goals__metric">
                <span class="goals__metric-value">24/7</span>
                <span class="goals__metric-text">контроль статуса</span>
              </div>
              <div class="goals__metric">
                <span class="goals__metric-value">AI</span>
                <span class="goals__metric-text">умная приоритизация</span>
              </div>
            </div>
          </div>

          <div class="goals__card goals__card--tall" data-aos="fade-up">
            <h3 class="goals__block-title">Схема процесса</h3>
            <ol class="goals__flow">
              <li class="goals__flow-item">
                Пользователь отправляет обращение через сайт или мобильное
                приложение.
              </li>
              <li class="goals__flow-item">
                Сервер сохраняет обращение в базе и присваивает статус «Новое».
              </li>
              <li class="goals__flow-item">
                AI‑модуль классифицирует обращение и оценивает срочность.
              </li>
              <li class="goals__flow-item">
                Админ видит обращение, назначает исполнителя или перенаправляет.
              </li>
              <li class="goals__flow-item">
                Исполнитель выполняет работу и обновляет статус.
              </li>
              <li class="goals__flow-item">
                Пользователь получает уведомление и проверяет результат.
              </li>
              <li class="goals__flow-item">
                Система собирает аналитику и строит прогнозы по районам.
              </li>
            </ol>
          </div>

          <div class="goals__side" data-aos="fade-up">
            <div class="goals__card goals__card--media">
              <div
                class="goals__media goals__media--wide"
                aria-hidden="true"
              ></div>
              <p class="goals__text">
                Прозрачные статусы, понятные сроки и история всех действий.
              </p>
            </div>

            <div class="goals__card">
              <h3 class="goals__block-title">Польза для города</h3>
              <p class="goals__text">
                CityHelp снижает бюрократию, повышает доверие жителей и улучшает
                качество городской среды.
              </p>
            </div>

            <div class="goals__card">
              <h3 class="goals__block-title">Польза для служб</h3>
              <p class="goals__text">
                Единая очередь задач, меньше дублей и автоматический анализ
                обращений для правильных приоритетов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.goals {
  &__wrapper {
    background-color: $tertiary-accent;
    color: $primary-accent;
    padding: $padding-xxl 0;
  }

  &__container {
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 $padding-xxl;
  }

  &__intro {
    display: grid;
    gap: 16px;
    margin-bottom: 48px;
  }

  &__headline {
    font-family: "SF Pro Rounded", "Lato", sans-serif;
    font-size: 42px;
    line-height: 120%;
    font-weight: 700;
  }

  &__lead {
    font-size: 16px;
    line-height: 160%;
    color: $primary-accent;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 20px;
  }

  &__card {
    grid-column: span 4;
    background: $white;
    border-radius: 22px;
    padding: 22px;
    box-shadow: $box-shadow;
    display: grid;
    gap: 12px;
  }

  &__card--wide {
    grid-column: span 8;
  }

  &__card--tall {
    grid-column: span 7;
    background: $white;
  }

  &__card--media {
    grid-column: span 4;
    background: $white;
  }

  &__side {
    grid-column: span 5;
    display: grid;
    gap: 20px;
  }

  &__block-title {
    font-size: 26px;
    line-height: 130%;
    font-weight: 700;
    color: $primary-accent;
  }

  &__text {
    font-size: 16px;
    line-height: 160%;
    color: rgba(40, 54, 24, 0.8);
  }

  &__media {
    width: 100%;
    border-radius: 24px;
    background:
      linear-gradient(140deg, rgba(96, 108, 56, 0.12), rgba(96, 108, 56, 0.05)),
      linear-gradient(0deg, rgba(254, 250, 224, 0.6), rgba(254, 250, 224, 0.6));
    border: 1px solid rgba(40, 54, 24, 0.12);
    box-shadow: 0 14px 32px rgba(40, 54, 24, 0.12);
  }

  &__media--wide {
    aspect-ratio: 16 / 7;
  }

  &__media--square {
    aspect-ratio: 1 / 1;
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  &__metric {
    // background: $tertiary-accent;
    border: 1px solid $primary-accent;
    box-shadow: $box-shadow;
    border-radius: 16px;
    padding: 12px;
    display: grid;
    gap: 6px;
  }

  &__metric-value {
    font-weight: 700;
    font-size: 18px;
  }

  &__metric-text {
    font-size: 12px;
    line-height: 140%;
    color: $primary-accent;
  }

  &__flow {
    display: grid;
    gap: 12px;
    padding: 0;
    margin: 0;
    list-style: none;
    counter-reset: step;
  }

  &__flow-item {
    position: relative;
    padding-left: 38px;
    font-size: 14px;
    line-height: 150%;
    color: $primary-accent;
  }

  &__flow-item::before {
    counter-increment: step;
    content: counter(step);
    position: absolute;
    left: 0;
    top: 2px;
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background-color: $secondary-accent;
    color: $tertiary-accent;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 700;
  }

  &__flow-item::after {
    content: "";
    position: absolute;
    left: 11px;
    top: 28px;
    width: 2px;
    height: calc(100% - 12px);
    background: rgba(96, 108, 56, 0.2);
  }

  &__flow-item:last-child::after {
    display: none;
  }

  @media (max-width: 900px) {
    &__grid {
      grid-template-columns: repeat(6, 1fr);
    }

    &__card,
    &__card--wide,
    &__card--tall,
    &__card--media {
      grid-column: span 6;
    }

    &__side {
      grid-column: span 6;
    }
  }

  @media (max-width: 640px) {
    &__wrapper {
      padding: $padding-xl 0;
    }

    &__container {
      padding: 0 $padding-lg;
    }

    &__headline {
      font-size: 32px;
    }

    &__lead {
      font-size: 16px;
    }

    &__block-title {
      font-size: 22px;
    }

    &__grid {
      grid-template-columns: 1fr;
    }

    &__card,
    &__card--wide,
    &__card--tall,
    &__card--media {
      grid-column: span 1;
    }

    &__side {
      grid-column: span 1;
    }

    &__metrics {
      grid-template-columns: 1fr;
    }
  }
}
</style>
