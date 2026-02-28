<template>
  <client-only>
    <teleport to="body">
      <transition name="fade">
        <div class="modal" v-if="isOpen">
          <div class="modal__wrapper" @click="emit('close')"></div>
          <div
            class="modal__block"
            :style="{ maxWidth: maxWidth }"
            :class="{ 'modal__block--full': fullScreen }"
          >
            <div class="modal__head">
              <div class="modal__title" v-if="title">{{ title }}</div>
              <UiIcon
                v-if="!hideClose"
                icon="close"
                size="size-24"
                @click="emit('close')"
                class="modal__close"
                :class="{ 'modal__close--only': !title }"
              />
            </div>
            <div
              class="modal__content"
              :class="{ 'modal__content--padding': fullScreen }"
            >
              <slot></slot>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </client-only>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  maxWidth: String,
  fullScreen: {
    type: Boolean,
    default: false,
  },
  hideClose: {
    type: Boolean,
    default: false,
  },
  title: String,
});

const emit = defineEmits(["close"]);
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  z-index: 400;
  align-items: center;
  justify-content: center;
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px 0;
  }
  &__title {
    color: $surface-600;
    font-size: 17.5px;
    font-weight: 700;
    line-height: 21px;
  }
  &__wrapper {
    position: absolute;
    z-index: -1;
    width: 1000%;
    height: 1000%;
    background: rgba(0, 0, 0, 0.5);
    transition: 0.2s;
  }
  &__block {
    background: $white;
    border-radius: $border-r-md;
    min-height: 160px;
    max-width: 300px;
    width: 100%;
    position: relative;
    &--full {
      height: 100%;
      border-radius: 0;
    }
  }
  &__close {
    cursor: pointer;
    z-index: 1;
    &--only {
      position: absolute;
      right: 16px;
      top: 16px;
    }
  }
  &__content {
    padding: 16px;
    &--padding {
      margin-top: 80px;
    }
  }
}

.fade-enter-active {
  animation: fall-left-in 0.2s ease-out forwards;
}

.fade-leave-active {
  animation: fall-left-out 0.2s ease-in forwards;
}

@keyframes fall-left-in {
  0% {
    opacity: 0;
    transform: translateY(100%) rotate(-30deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}

@keyframes fall-left-out {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
  100% {
    opacity: 0;
    transform: translateY(100%) rotate(30deg);
  }
}
</style>
