<template>
  <div class="load">
    <div class="load__wrapper">
      <img
        class="load__image"
        src="/assets/images/content/no-image.png"
        alt="No Image"
      />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.load {
  width: 100%;
  max-width: 100%;
  height: 100%;
  &__wrapper {
    width: 100%;
    max-width: 100%;
    height: 100%;
    background-color: $white;
    border-radius: $border-r-md;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__image {
    // width: 100%;
    margin: auto;
    height: 200px;
  }
}
</style>
