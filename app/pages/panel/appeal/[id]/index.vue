<template>
  <section class="appeal">
    <div class="appeal__wrapper">
      <div class="appeal__top">
        <h2 class="appeal__title title-md">Обращение 2</h2>
        <div class="appeal__top-inner">
          <UiButton
            before-icon="trash-i"
            icon-size="size-24"
            icon-color="red-300"
            class="appeal__btn appeal__btn--delete secondary-btn"
            label="Удалить обращение"
            @action="openDeleteModal"
          />
        </div>
      </div>

      <div class="appeal__box">
        <div
          class="appeal__content"
          :class="{ 'appeal__content--aside': !asideStore.isOpen }"
        >
          <ThePanelAppealContent />

          <ThePanelAppealAdminAnswer />

          <ThePanelAppealAdminTextarea />
        </div>

        <div
          class="appeal__aside"
          :class="{ 'appeal__aside--aside': !asideStore.isOpen }"
        >
          <div class="appeal__aside-inner">
            <ThePanelAppealAsideInfo />

            <UiButton
              @action="openEvaluationModal"
              class="appeal__aside-btn secondary-btn"
              label="Оценить"
            />
          </div>
        </div>
      </div>
    </div>

    <UiUpToTop class="appeal__up" />
  </section>

  <UiModal
    :is-open="isOpenEvaluationModal"
    title="Оцените обращение"
    max-width="600px"
    @close="closeEvaluationModal"
  >
    <ModalsEvaluationAppeal @like="onLike" @dislike="onDislike" />
  </UiModal>

  <UiModal
    :is-open="isOpenDeleteModal"
    title="Ты точно уверены?"
    max-width="600px"
    @close="closeDeleteModal"
  >
    <ModalsDeleteAppeal @cancel="onCancel" @delete="onDelete" />
  </UiModal>
</template>

<script setup>
const asideStore = useAsideStore();
const route = useRoute();

const isOpenEvaluationModal = ref(false);
const isOpenDeleteModal = ref(false);

const openDeleteModal = () => {
  isOpenDeleteModal.value = true;
};

const closeDeleteModal = () => {
  isOpenDeleteModal.value = false;
};

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

const onCancel = () => {
  closeDeleteModal();
};

const onDelete = () => {
  closeDeleteModal();
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
    align-items: flex-start;
    gap: $gap-md;
  }
  &__content {
    flex-grow: 1;
    max-width: 70%;
    width: 100%;
    padding: $padding-md;
    border-radius: $border-r-md;
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    &--aside {
      max-width: 60%;
    }
  }
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $gap-md;
  }
  &__up {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 50;
  }
  &__btn {
    &--delete {
      border: 1px solid $red-300;
      color: $red-300;
      &:hover {
        background: transparent;
      }
    }
  }
  &__aside {
    position: relative;
    flex-shrink: 0;
    align-self: flex-start;
    max-width: 30%;
    width: 100%;
    padding: $padding-md;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
    gap: $gap-xl;
    &-inner {
      position: sticky;
      top: 20px;
      display: flex;
      flex-direction: column;
      gap: $gap-xl;
    }
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
    &__top {
      align-items: flex-start;
      flex-direction: column;
    }
    &__box {
      flex-direction: column;
      gap: $gap-xxl;
    }
    &__aside,
    &__content {
      max-width: 100%;
    }
    &__aside {
      position: relative;
      order: -1;
    }
  }
}
</style>
