<script setup>
const { t } = useI18n();

const props = defineProps({
  description: { type: String, required: true },
  isOpen: { type: Boolean, default: false },
  limit: { type: Number, default: 200 },
});

const emit = defineEmits(["toggle"]);

const fullHtml = ref("");
const truncatedHtml = ref("");
const localOpen = ref(props.isOpen);

onMounted(() => {
  fullHtml.value = props.description;
  truncatedHtml.value = truncateHtml(props.description, props.limit);
});

watch(
  () => props.isOpen,
  (val) => {
    localOpen.value = val;
  },
);

watch(
  () => props.description,
  (newVal) => {
    if (process.client) {
      fullHtml.value = newVal;
      truncatedHtml.value = truncateHtml(newVal, props.limit);
    }
  },
  { immediate: true },
);

function truncateHtml(html, limit) {
  if (process.client) {
    const div = document.createElement("div");
    div.innerHTML = html || "";

    let result = "";
    let length = 0;

    function traverse(node) {
      if (length >= limit) return;
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (length + text.length <= limit) {
          result += text;
          length += text.length;
        } else {
          result += text.slice(0, limit - length) + "...";
          length = limit;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        result += `<${node.nodeName.toLowerCase()}${getAttrs(node)}>`;
        for (let child of node.childNodes) traverse(child);
        result += `</${node.nodeName.toLowerCase()}>`;
      }
    }

    function getAttrs(node) {
      return Array.from(node.attributes || [])
        .map((a) => ` ${a.name}="${a.value}"`)
        .join("");
    }

    for (let child of div.childNodes) traverse(child);
    return result;
  }
}

const isTruncated = computed(() => fullHtml.value !== truncatedHtml.value);

function onToggle() {
  localOpen.value = !localOpen.value;
  emit("toggle", localOpen.value);
}
</script>

<template>
  <div class="trunc">
    <div class="trunc__wrapper" @click="onToggle">
      <client-only>
        <div v-if="localOpen" v-html="fullHtml"></div>
        <div v-else v-html="truncatedHtml" class="trunc__short"></div>

        <button
          v-if="isTruncated"
          class="trunc__more"
          :class="{ 'trunc__more--hide': isOpen }"
          type="button"
        >
          {{ localOpen ? t("Скрыть") : t("Читать дальше") }}
        </button>
      </client-only>
    </div>
  </div>
</template>

<style scoped lang="scss">
.trunc {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &__more {
    margin-top: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: $secondary-accent;
    &--hide {
      opacity: 0;
    }
  }
}
</style>
