<template>
  <section class="textarea">
    <div class="textarea__wrapper">
      <h5 class="textarea__title title-md title-point">Комментировать</h5>

      <UiTextarea v-model="comment" />

      <UiButton class="textarea__btn primary-btn" label="Отправить" />
    </div>
  </section>
</template>

<script setup>
const comment = ref("");
</script>

<style lang="scss" scoped>
.textarea {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__btn {
    margin-left: auto;
  }
}
</style>
