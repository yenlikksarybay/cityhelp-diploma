<template>
  <div class="map">
    <div class="map__wrapper"></div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.map {
  width: 100%;
  &__wrapper {
    border-radius: $border-r-md;
    background-color: $surface-200;
    width: 100%;
    min-height: 450px;
    box-shadow: $box-shadow;
  }
}
</style>
