<template>
  <div class="detail-header">
    <div class="detail-header__main">
      <div class="detail-header__avatar">
        <img
          v-if="avatarSrc"
          class="detail-header__avatar-image"
          :src="avatarSrc"
          :alt="title"
        />
        <div v-else class="detail-header__avatar-default">
          {{ avatarInitials }}
        </div>
      </div>

      <div class="detail-header__text">
        <h2 class="detail-header__title title-md">
          {{ title }}
        </h2>
        <p class="detail-header__sub">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <UiButton
      v-if="buttonLabel"
      tag="a"
      :href="buttonHref"
      :label="buttonLabel"
      class="secondary-btn"
    />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  buttonLabel: {
    type: String,
    default: "",
  },
  buttonHref: {
    type: String,
    default: "",
  },
  avatarSrc: {
    type: String,
    default: "",
  },
  avatarInitials: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.detail-header {
  display: flex;
  justify-content: space-between;
  gap: $gap-md;
  align-items: flex-start;

  &__main {
    display: flex;
    align-items: center;
    gap: $gap-md;
  }

  &__avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: $box-shadow;
  }

  &__avatar-image,
  &__avatar-default {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__avatar-default {
    display: flex;
    align-items: center;
    justify-content: center;
    background: $secondary-accent;
    color: $white;
    font-size: 20px;
    font-weight: 700;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__sub {
    color: $surface-500;
  }
}

@media (max-width: 900px) {
  .detail-header {
    flex-direction: column;

    &__main {
      width: 100%;
    }
  }
}
</style>
