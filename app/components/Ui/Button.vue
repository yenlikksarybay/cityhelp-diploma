<template>
  <div
    class="button"
    @click="href ? router.push(href) : checkState()"
    :class="{
      disabled: disabled,
      loading: isLoading,
    }"
  >
    <UiIcon
      v-if="beforeIcon && !(disabled || isLoading)"
      :icon="beforeIcon"
      :color="iconColor"
      :size="iconSize"
      :deg="iconDeg"
    />
    <button
      v-if="tag === 'button'"
      class="button__btn"
      :disabled="disabled || isLoading"
      :type="type"
      :class="[color]"
    >
      {{ label }}
    </button>
    <nuxt-link
      v-if="tag === 'a'"
      class="button__btn"
      :to="href"
      :disabled="disabled || isLoading"
      :class="[color]"
    >
      {{ label }}
    </nuxt-link>
    <UiIcon
      v-if="afterIcon && !(disabled || isLoading)"
      :icon="afterIcon"
      :color="iconColor"
      :size="iconSize"
      :deg="iconDeg"
    />
  </div>
</template>

<script setup>
const router = useRouter();
const emit = defineEmits(["action"]);
const props = defineProps({
  label: String,
  beforeIcon: String,
  afterIcon: String,
  iconSize: String,
  iconColor: String,
  iconDeg: String,
  disabled: Boolean,
  isLoading: Boolean,
  href: String,
  color: String,
  type: {
    type: String,
    default: "button",
  },
  tag: {
    type: String,
    default: "button",
  },
});

const checkState = () => {
  if (props.disabled || props.isLoading) {
    return;
  }
  emit("action");
};
</script>

<style lang="scss" scoped>
.button {
  position: relative;
  border-radius: 28px;
  cursor: pointer;
  height: 100%;
  display: flex;
  gap: $gap-xs;
  align-items: center;
  padding: $padding-md;
  &__btn {
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
  }
}

.disabled {
  pointer-events: none;
  opacity: 0.7;
  background-color: $surface-400;
}

.loading {
  color: transparent !important;
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 4px;
    height: 4px;
    border-radius: 100%;
    box-shadow:
      0 -10px 0 1px #fff,
      10px 0 #fff,
      0 10px #fff,
      -10px 0 #fff,
      -7px -7px 0 0.5px #fff,
      7px -7px 0 1.5px #fff,
      7px 7px #fff,
      -7px 7px #fff;
    animation: spinZoom 1s steps(8) infinite;
  }
}

@keyframes spinZoom {
  0% {
    transform: scale(0.75) rotate(0);
  }
  100% {
    transform: scale(0.75) rotate(360deg);
  }
}
</style>
