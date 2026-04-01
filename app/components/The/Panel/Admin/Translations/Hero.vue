<template>
  <div class="hero">
    <div>
      <h2 class="hero__title title-md hidden">Админка переводов</h2>
      <p class="hero__text">
        Управляйте ключами и текстами для казахского, русского и английского
        языков в одном месте.
      </p>
    </div>
    <div class="hero__stats">
      <div class="hero__stat">
        <span class="hero__value">{{ visible }}</span>
        <span class="hero__label">Отображается</span>
      </div>
      <div class="hero__stat">
        <span class="hero__value">{{ total }}</span>
        <span class="hero__label">Всего ключей</span>
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $gap-lg;
  padding: $padding-lg;
  border-radius: $border-r-md;
  background: linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%);
  box-shadow: $box-shadow;

  &__title {
    margin-bottom: $gap-sm;
  }

  &__text {
    max-width: 680px;
    color: $surface-500;
    line-height: 1.5;
  }

  &__stats {
    display: flex;
    gap: $gap-md;
    width: fit-content;
  }

  &__stat {
    min-width: 140px;
    padding: $padding-md;
    border-radius: $border-r-md;
    background-color: $white;
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    gap: $gap-xs;
  }

  &__value {
    font-size: 28px;
    font-weight: 700;
    color: $secondary-accent;
  }

  &__label {
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
