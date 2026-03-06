<template>
  <div class="status">
    <div class="status__wrapper">
      <p
        class="status__text"
        :class="{
          'status__text--solved': status === 'solved',
          'status__text--pending': status === 'pending',
          'status__text--rejected': status === 'rejected',
        }"
      >
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: String,
  status: String,
});
</script>

<style lang="scss" scoped>
.status {
  &__wrapper {
  }
  &__text {
    &--solved {
      color: $green-500;
    }
    &--pending {
      color: $yellow-400;
    }
    &--rejected {
      color: $red-300;
    }
  }
}
</style>
