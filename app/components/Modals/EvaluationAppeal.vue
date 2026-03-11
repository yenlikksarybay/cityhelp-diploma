<template>
  <div class="evaluation">
    <div class="evaluation__wrapper">
      <button
        class="evaluation__btn evaluation__btn--like"
        @click="emit('like')"
      >
        <UiIcon icon="like-i" size="size-42" color="white" />
      </button>
      <button
        class="evaluation__btn evaluation__btn--dislike"
        @click="emit('dislike')"
      >
        <UiIcon icon="like-i" size="size-42" color="white" deg="down" />
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["like", "dislike"]);
</script>

<style lang="scss" scoped>
.evaluation {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__btn {
    width: 100%;
    padding: $padding-xxl;
    border-radius: $border-r-md;
    &--like {
      background-color: $green-500;
    }
    &--dislike {
      background-color: $red-300;
    }
  }
}
</style>
