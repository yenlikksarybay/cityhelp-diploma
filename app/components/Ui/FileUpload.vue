<template>
  <div class="upload">
    <input
      ref="fileInputRef"
      class="upload__input"
      type="file"
      :accept="accept"
      @change="onInputChange"
    />

    <div
      class="upload__wrapper"
      :class="{ 'upload__wrapper--dragging': isDragging }"
      role="button"
      tabindex="0"
      @click="openFileDialog"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @keydown.enter.prevent="openFileDialog"
      @keydown.space.prevent="openFileDialog"
    >
      <template v-if="previewUrl">
        <img class="upload__preview" :src="previewUrl" alt="Фото превью" />
        <div class="upload__overlay">
          <p class="upload__name">{{ fileName }}</p>
          <div class="upload__actions">
            <button
              class="upload__btn"
              type="button"
              @click.stop="openFileDialog"
            >
              Заменить
            </button>
            <button
              class="upload__btn upload__btn--danger"
              type="button"
              @click.stop="removeFile"
            >
              Удалить
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="upload__empty">
          <UiIcon icon="plus-i" size="size-24" color="#606C38" />
          <h4 class="upload__title">Добавьте фотографию</h4>
          <p class="upload__text">
            Перетащите фото сюда или нажмите, чтобы выбрать файл
          </p>
          <span class="upload__hint">{{ hintText }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  accept: {
    type: String,
    default: "image/png,image/jpeg,image/webp",
  },
  maxSizeMb: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["update:modelValue", "invalid-file"]);

const fileInputRef = ref(null);
const isDragging = ref(false);
const dragDepth = ref(0);
const previewUrl = ref("");

const fileName = computed(() => props.modelValue?.name || "");
const hintText = computed(() => `PNG, JPG, WEBP до ${props.maxSizeMb}MB`);

const clearPreviewUrl = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = "";
  }
};

const setPreviewFromFile = (file) => {
  clearPreviewUrl();
  if (!file) return;
  previewUrl.value = URL.createObjectURL(file);
};

watch(
  () => props.modelValue,
  (file) => {
    setPreviewFromFile(file);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  clearPreviewUrl();
});

const openFileDialog = () => {
  fileInputRef.value?.click();
};

const isValidImageFile = (file) => {
  const isImage = file?.type?.startsWith("image/");
  const maxSize = props.maxSizeMb * 1024 * 1024;
  const isSizeValid = file.size <= maxSize;
  return isImage && isSizeValid;
};

const handleFile = (file) => {
  if (!file) return;

  if (!isValidImageFile(file)) {
    emit("invalid-file", file);
    return;
  }

  emit("update:modelValue", file);
};

const onInputChange = (event) => {
  const file = event.target?.files?.[0] || null;
  handleFile(file);
  event.target.value = "";
};

const onDragEnter = () => {
  dragDepth.value += 1;
  isDragging.value = true;
};

const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  dragDepth.value = Math.max(0, dragDepth.value - 1);
  if (dragDepth.value === 0) {
    isDragging.value = false;
  }
};

const onDrop = (event) => {
  dragDepth.value = 0;
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0] || null;
  handleFile(file);
};

const removeFile = () => {
  emit("update:modelValue", null);
};
</script>

<style lang="scss" scoped>
.upload {
  width: 100%;

  &__input {
    display: none;
  }

  &__wrapper {
    display: flex;
    position: relative;
    min-height: 280px;
    max-height: 500px;
    width: 100%;
    justify-content: center;
    align-items: center;
    border-radius: $border-r-xl;
    border: 2px dashed rgba($secondary-accent, 0.35);
    cursor: pointer;
    overflow: hidden;
    transition:
      border-color 0.25s ease,
      box-shadow 0.25s ease,
      transform 0.25s ease;

    &:hover {
      border-color: rgba($secondary-accent, 0.75);
      box-shadow: 0 14px 30px rgba($secondary-accent, 0.18);
      transform: translateY(-2px);
    }

    &:focus-visible {
      outline: 2px solid rgba($secondary-accent, 0.5);
      outline-offset: 3px;
    }

    &--dragging {
      border-color: $secondary-accent;
      box-shadow: 0 16px 30px rgba($secondary-accent, 0.22);
      transform: scale(1.01);
    }
  }

  &__empty {
    text-align: center;
    padding: $padding-xxl;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $gap-md;
  }

  &__title {
    color: $secondary-accent;
    font-size: 20px;
    font-weight: 600;
  }

  &__text {
    color: $surface-600;
    max-width: 360px;
    line-height: 1.4;
  }

  &__hint {
    color: $surface-400;
    font-size: 13px;
    border-radius: $border-r-sm;
    border: 1px solid rgba($secondary-accent, 0.2);
    background-color: rgba($white, 0.75);
    padding: $padding-xs $padding-md;
  }

  &__preview {
    width: 100%;
    height: 100%;
    min-height: 280px;
    max-height: 500px;
    object-fit: scale-down;
    display: block;
  }

  &__overlay {
    position: absolute;
    inset: auto 0 0 0;
    padding: $padding-lg;
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
    background: linear-gradient(
      180deg,
      transparent,
      rgba($primary-accent, 0.82)
    );
  }

  &__name {
    color: $white;
    font-size: 14px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
  }

  &__actions {
    display: flex;
    gap: $gap-sm;
  }

  &__btn {
    border: 1px solid rgba($white, 0.65);
    color: $white;
    padding: 7px 12px;
    border-radius: $border-r-sm;
    font-size: 13px;
    background: rgba($white, 0.08);
    backdrop-filter: blur(3px);
    transition: 0.2s ease;

    &:hover {
      background: rgba($white, 0.18);
    }

    &--danger:hover {
      border-color: rgba($red-300, 0.8);
      background: rgba($red-300, 0.2);
    }
  }

  @media (max-width: 768px) {
    &__wrapper {
      min-height: 240px;
    }

    &__preview {
      min-height: 240px;
    }
  }
}
</style>
