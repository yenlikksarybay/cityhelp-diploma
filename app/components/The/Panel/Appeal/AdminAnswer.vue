<template>
  <section class="answer">
    <div class="answer__wrapper">
      <h4 class="answer__title title-md title-point">Ответ на обращение</h4>

      <div class="answer__box">
        <div class="answer__top">
          <p class="answer__role">
            Модератор - <span class="answer__baige">Yenlik</span>
          </p>
          <p class="answer__date">21.2.2026 14:45</p>
        </div>
        <p class="answer__comment">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
          corrupti nemo placeat consequuntur nostrum voluptatem ipsum architecto
          vitae sed tempore!
        </p>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.answer {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__box {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
    background-color: $surface-100;
    padding: $padding-md;
    border-radius: $border-r-md;
  }
  &__baige {
    background-color: $secondary-accent;
    color: $white;
    padding: 4px $padding-xs;
    border-radius: $border-r-md;
  }
  &__role {
    font-weight: 500;
  }
  &__top {
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
    align-items: center;
  }
  &__comment {
    line-height: 120%;
    color: $surface-600;
  }
  &__date {
    color: $surface-300;
    font-size: 12px;
  }
}
</style>
