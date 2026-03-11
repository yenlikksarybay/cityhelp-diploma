<template>
  <section class="appeal">
    <div class="appeal__wrapper">
      <h2 class="appeal__title title-md">Обращение 2</h2>

      <div class="appeal__box">
        <div
          class="appeal__content"
          :class="{ 'appeal__content--aside': !asideStore.isOpen }"
        >
          <ThePanelAppealContent />

          <ThePanelAppealAdminAnswer />
        </div>

        <div
          class="appeal__aside"
          :class="{ 'appeal__aside--aside': !asideStore.isOpen }"
        >
          <ThePanelAppealAsideInfo />

          <UiButton
            @action="openEvaluationModal"
            class="appeal__aside-btn secondary-btn"
            label="Оценить"
          />
        </div>
      </div>
    </div>
  </section>

  <UiModal
    :is-open="isOpenEvaluationModal"
    title="Оцените обращение"
    max-width="600px"
    @close="closeEvaluationModal"
  >
    <ModalsEvaluationAppeal @like="onLike" @dislike="onDislike" />
  </UiModal>
</template>

<script setup>
const asideStore = useAsideStore();
const route = useRoute();

const isOpenEvaluationModal = ref(false);

const openEvaluationModal = () => {
  isOpenEvaluationModal.value = true;
};

const closeEvaluationModal = () => {
  isOpenEvaluationModal.value = false;
};

const onLike = () => {
  useNotify({ title: "Оценено", status: "success" });
  closeEvaluationModal();
};

const onDislike = () => {
  useNotify({ title: "Оценено", status: "success" });
  closeEvaluationModal();
};
</script>

<style lang="scss" scoped>
.appeal {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
  }
  &__box {
    display: flex;
    justify-content: space-between;
    gap: $gap-md;
  }
  &__content {
    flex-grow: 1;
    max-width: 70%;
    width: 100%;
    padding: $padding-md;
    border-radius: $border-r-md;
    &--aside {
      max-width: 60%;
    }
  }
  &__aside {
    flex-shrink: 0;
    max-width: 30%;
    width: 100%;
    padding: $padding-md;
    border-radius: $border-r-md;
    height: 100%;
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    gap: $gap-xl;
    &-btn {
      width: 100%;
    }
    &--aside {
      max-width: 40%;
    }
  }
}

@media (max-width: 1200px) {
  .appeal {
    &__box {
      flex-direction: column;
    }
    &__aside,
    &__content {
      max-width: 100%;
    }
    &__aside {
      order: -1;
    }
  }
}
</style>
