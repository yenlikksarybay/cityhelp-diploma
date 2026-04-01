<template>
  <main class="landing">
    <div class="landing__wrapper">
      <TheLandingIntroduce />
      <TheLandingRepresent />
      <TheLandingGoals />
      <TheLandingStages />
      <TheLandingCommunity />
      <TheLandingHelpUs />
    </div>

    <div class="landing__floating" :class="{ 'is-visible': shouldShowFloat }">
      <UiButton
        class="landing__btn primary-btn primary-btn--hover"
        label="Создать обращение"
        @action="checkAuth"
      />
    </div>
  </main>
</template>

<script setup>
const router = useRouter();
const authStore = useAuthStore();
definePageMeta({
  layout: "landing",
});

useSeo({
  title:
    "интеллектуальная веб-платформа для управления городскими обращениями.",
  description:
    "Сервис объединяет граждан и муниципальные службы, отображает проблемы на карте, автоматизирует обработку заявок и применяет ИИ для приоритизации и аналитики. Решение направлено на цифровизацию городского управления.",
});

const showFloat = ref(false);
const hideForHelp = ref(false);
const shouldShowFloat = computed(() => showFloat.value && !hideForHelp.value);

let observer;

const checkAuth = () => {
  if (authStore.isAuth) {
    router.push("/panel");
    return;
  }
  router.push("/?auth=login");
  authStore.setAuthModal(true);
};

const handleScroll = () => {
  showFloat.value = window.scrollY > 200;
};

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  const helpSection = document.querySelector("[data-help-section]");
  if (helpSection) {
    observer = new IntersectionObserver(
      (entries) => {
        hideForHelp.value = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.25 },
    );
    observer.observe(helpSection);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  if (observer) observer.disconnect();
});
</script>

<style lang="scss" scoped>
.landing {
  &__wrapper {
    display: flex;
    flex-direction: column;
    font-family: "Lato", sans-serif;
  }

  &__floating {
    position: fixed;
    left: 50%;
    bottom: 24px;
    transform: translate(-50%, 20px);
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.35s ease,
      transform 0.35s ease;
    z-index: 50;
  }
  &__btn {
    border: 1px solid $tertiary-accent;
    &:hover {
      border: 1px solid $secondary-accent;
      background-color: $tertiary-accent;
    }
  }

  &__floating.is-visible {
    opacity: 1;
    transform: translate(-50%, 0);
    pointer-events: auto;
  }

  @media (max-width: 640px) {
    &__floating {
      bottom: 16px;
    }
  }
}
</style>
