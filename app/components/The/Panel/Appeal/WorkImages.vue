<template>
  <section class="work">
    <div class="work__wrapper">
      <p class="work__label">Фотографии результата</p>
      <p class="work__hint">Можно добавить до 5 изображений</p>

      <UiFileUpload
        v-if="files.length < 5"
        v-model="currentFile"
        :max-size-mb="4.5"
      />

      <div v-if="files.length" class="work__list">
        <div
          v-for="(item, index) in files"
          :key="`${item.name}-${index}`"
          class="work__item"
        >
          <img class="work__thumb" :src="item.preview" :alt="item.name" />
          <div class="work__info">
            <p class="work__name">{{ item.name }}</p>
            <p class="work__size">{{ formatSize(item.size) }}</p>
          </div>
          <button class="work__remove" type="button" @click="removeImage(index)">
            Удалить
          </button>
        </div>
      </div>

      <p v-if="files.length >= 5" class="work__limit">
        Достигнут лимит 5 изображений
      </p>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const currentFile = ref(null);

const files = computed({
  get: () => props.modelValue || [],
  set: (value) => emit("update:modelValue", value),
});

const formatSize = (size = 0) => {
  if (!size) return "0 KB";
  const mb = size / (1024 * 1024);
  return `${mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`}`;
};

watch(
  () => currentFile.value,
  (file) => {
    if (!file) return;
    if (files.value.length >= 5) {
      currentFile.value = null;
      return;
    }

    const nextFile = {
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    };

    files.value = [...files.value, nextFile];
    currentFile.value = null;
  },
);

const removeImage = (index) => {
  const next = [...files.value];
  const [removed] = next.splice(index, 1);
  if (removed?.preview) {
    URL.revokeObjectURL(removed.preview);
  }
  files.value = next;
};

onBeforeUnmount(() => {
  files.value.forEach((item) => {
    if (item?.preview) {
      URL.revokeObjectURL(item.preview);
    }
  });
});
</script>

<style lang="scss" scoped>
.work {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__label {
    font-weight: 700;
  }
  &__hint {
    margin-top: -6px;
    color: $surface-500;
    font-size: 14px;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
  }
  &__item {
    display: flex;
    align-items: center;
    gap: $gap-md;
    border: 1px solid $surface-200;
    border-radius: $border-r-md;
    padding: $padding-sm;
    background: $white;
  }
  &__thumb {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: $border-r-sm;
    background: $surface-100;
  }
  &__info {
    flex: 1;
    min-width: 0;
  }
  &__name {
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__size {
    color: $surface-500;
    font-size: 13px;
  }
  &__remove {
    border: 0;
    background: transparent;
    color: $red-300;
    font-weight: 600;
    cursor: pointer;
  }
  &__limit {
    color: $surface-500;
    font-size: 13px;
  }
}
</style>
