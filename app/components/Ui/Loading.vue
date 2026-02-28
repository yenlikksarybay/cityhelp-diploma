<template>
  <svg class="spinner" viewBox="0 0 50 50">
    <circle
      class="spinner__circle"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke-width="5"
      stroke-linecap="round"
    />
  </svg>
</template>

<style lang="scss" scoped>
.spinner {
  width: 48px;
  height: 48px;
  animation: rotate 2s linear infinite;
  &__circle {
    stroke: $primary-accent;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
