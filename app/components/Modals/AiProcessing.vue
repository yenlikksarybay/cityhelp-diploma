<template>
  <section class="process">
    <div class="process__wrapper">
      <UiLoading />

      <h4 class="process__name">
        {{ props.title }}<span class="process__dots loading-dots"></span>
      </h4>

      <transition name="slide-down" mode="out-in" v-if="attempts < 3">
        <p class="process__description" :key="currentMessage">
          {{ currentMessage }}
        </p>
      </transition>

      <div class="process__btns" v-if="attempts >= 3">
        <UiButton
          @action="emit('retry')"
          label="Повторить попытку"
          class="primary-btn"
        />
        <UiButton
          @action="emit('close')"
          label="Закрыть"
          class="secondary-btn"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["close", "retry"]);

const props = defineProps({
  attempts: Number,
  title: {
    type: String,
    default: "Обращение перепроверяется",
  },
  messages: {
    type: Array,
    default: () => [
      "ИИ перечитывает описание обращения...",
      "Сверяем фото, локацию и выбранную категорию...",
      "Проверяем, не требует ли обращение доработки...",
      "Параметры обращения пересчитываются заново...",
      "Готовим новый результат проверки...",
    ],
  },
  });

const messages = computed(() =>
  Array.isArray(props.messages) && props.messages.length
    ? props.messages
    : [],
);

const currentMessage = ref(messages.value[0] || "ИИ перепроверяет обращение...");
let interval;

onMounted(() => {
  interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * messages.value.length);
    currentMessage.value = messages.value[randomIndex] || currentMessage.value;
  }, 2800);
});

onBeforeUnmount(() => clearInterval(interval));
</script>

<style lang="scss" scoped>
.process {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xl;
    align-items: center;
    padding: $padding-xl;
  }
  &__name {
    font-size: 20px;
    font-weight: 500;
  }
  &__description {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: $surface-600;
  }
  &__btns {
    display: flex;
    align-content: center;
    gap: $gap-md;
  }
}
</style>
