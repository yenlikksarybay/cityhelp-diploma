<template>
  <div class="hero">
    <div class="hero__wrapper">
      <div class="hero__top">
        <h2 class="hero__title title-md hidden">AI Промты</h2>
        <p class="hero__text">
          Управляйте поведением AI через отдельную админку: храните роли,
          системные инструкции, шаблоны и ограничения в одном рабочем месте.
        </p>
      </div>

      <div class="hero__stats">
        <div class="hero__stat">
          <span class="hero__value">{{ total }}</span>
          <span class="hero__label">Промтов</span>
        </div>
        <div class="hero__stat">
          <span class="hero__value">{{ visible }}</span>
          <span class="hero__label">В списке</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  total: { type: Number, default: 0 },
  visible: { type: Number, default: 0 },
});
</script>

<style lang="scss" scoped>
.hero {
  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $gap-xl;
    padding: 22px;
    border-radius: $border-r-lg;
    background:
      radial-gradient(
        circle at top right,
        rgba(34, 197, 94, 0.18),
        transparent 24%
      ),
      linear-gradient(135deg, #f6faf4 0%, #eef7ea 100%);
    border: 1px solid rgba(34, 197, 94, 0.12);
    box-shadow: $box-shadow;
  }

  &__title {
    margin-bottom: $gap-sm;
  }

  &__text {
    line-height: 1.55;
    color: $surface-500;
  }

  &__stats {
    display: flex;
    gap: $gap-md;
    flex-shrink: 0;
  }

  &__stat {
    min-width: 130px;
    padding: 14px;
    border-radius: $border-r-md;
    background-color: rgba(255, 255, 255, 0.88);
    border: 1px solid rgba(34, 197, 94, 0.1);
  }

  &__value {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: $green-500;
  }

  &__label {
    display: block;
    margin-top: 4px;
    color: $surface-500;
    font-size: 14px;
  }
}

@media (max-width: 900px) {
  .hero {
    flex-direction: column;

    &__stats {
      width: 100%;
    }
  }
}

@media (max-width: 625px) {
  .hero {
    &__stats {
      flex-direction: column;
    }

    &__stat {
      min-width: 0;
      width: 100%;
    }
  }
}
</style>
