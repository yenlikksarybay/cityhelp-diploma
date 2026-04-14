<template>
  <div class="docs-layout">
    <header class="docs-layout__header">
      <NuxtLink class="docs-layout__brand" to="/">
        <UiLogo />

        <!-- <h1 class="docs-layout__title">Api документация</h1> -->
      </NuxtLink>

      <nav class="docs-layout__nav">
        <NuxtLink to="/" class="docs-layout__link">Главная</NuxtLink>
        <NuxtLink to="/panel" class="docs-layout__link">Панель</NuxtLink>
      </nav>
    </header>

    <main class="docs-layout__main">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.docs-layout {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(
      circle at top left,
      rgba($secondary-accent, 0.12),
      transparent 28%
    ),
    linear-gradient(180deg, #f6f7f1 0%, #eef2e4 100%);

  &__header {
    max-width: 1280px;
    margin: 0 auto 24px;
    padding: 18px 22px;
    border-radius: 24px;
    background: rgba($white, 0.88);
    backdrop-filter: blur(18px);
    box-shadow: $box-shadow;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $gap-lg;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: $gap-md;
    color: $surface-600;
  }

  &__logo {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: $secondary-accent;
    color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  &__eyebrow {
    font-size: 13px;
    color: $surface-500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__title {
    font-size: 28px;
    font-weight: 800;
    text-align: center;
  }

  &__nav {
    display: flex;
    gap: $gap-md;
    flex-wrap: wrap;
  }

  &__link {
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid rgba($secondary-accent, 0.18);
    background: rgba($secondary-accent, 0.06);
    color: $surface-600;
    transition: 0.2s ease;

    &:hover {
      background: rgba($secondary-accent, 0.12);
    }
  }

  &__main {
    max-width: 1280px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .docs-layout {
    padding: 16px;

    &__header {
      flex-direction: column;
      align-items: stretch;
    }

    &__title {
      font-size: 24px;
    }
  }
}
</style>
