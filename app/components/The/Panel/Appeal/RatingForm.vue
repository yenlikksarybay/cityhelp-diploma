<template>
  <section v-if="show" class="rating">
    <div class="rating__wrapper">
      <h4 class="rating__title title-md title-point">Оцените обращение</h4>
      <p class="rating__text">Выберите оценку от 1 до 5 и оставьте комментарий при желании.</p>

      <div class="rating__scores">
        <button
          v-for="score in scores"
          :key="score"
          type="button"
          class="rating__score"
          :class="{ 'rating__score--active': selectedScore === score }"
          @click="selectedScore = score"
        >
          {{ score }}
        </button>
      </div>

      <UiTextarea v-model="comment" placeholder="Комментарий к оценке" />

      <div class="rating__actions">
        <UiButton
          class="rating__btn primary-btn"
          label="Отправить оценку"
          :disabled="!selectedScore || isSubmitting"
          @action="submit"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["submit"]);

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const scores = [1, 2, 3, 4, 5];
const selectedScore = ref(null);
const comment = ref("");

const submit = () => {
  if (!selectedScore.value) return;
  emit("submit", {
    score: selectedScore.value,
    comment: comment.value.trim(),
  });
};
</script>

<style lang="scss" scoped>
.rating {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    padding: $padding-md;
    border-radius: $border-r-md;
    background: $surface-100;
  }
  &__text {
    color: $surface-500;
    font-size: 14px;
  }
  &__scores {
    display: flex;
    gap: $gap-sm;
    flex-wrap: wrap;
  }
  &__score {
    width: 44px;
    height: 44px;
    border-radius: $border-r-md;
    border: 1px solid $surface-200;
    background: $white;
    font-weight: 700;
    cursor: pointer;
    &--active {
      background: $secondary-accent;
      color: $white;
      border-color: $secondary-accent;
    }
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
  &__btn {
    min-width: 200px;
  }
}
</style>
