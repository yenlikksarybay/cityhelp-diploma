<template>
  <section class="appeals">
    <div class="appeals__wrapper">
      <div class="appeals__box">
        <h2 class="appeals__title title-md title-point">Для вас</h2>
        <ThePanelEmployeeAppealsTable />
      </div>

      <hr class="appeals__hr" />

      <div class="appeals__box">
        <h2 class="appeals__title title-md title-point">Активные</h2>
        <ThePanelEmployeeAppealsTable />
      </div>

      <hr class="appeals__hr" />

      <div class="appeals__box">
        <h2 class="appeals__title title-md title-point">Отклоненные</h2>
        <ThePanelEmployeeAppealsTable />
      </div>
    </div>
  </section>
</template>

<script setup>
useSeo({ title: "Обращений" });
</script>

<style lang="scss" scoped>
.appeals {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: $gap-xxl;
  }
  &__box {
    display: flex;
    flex-direction: column;
    gap: $gap-md;
    padding: $padding-md;
    background-color: $surface-100;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
  }
  &__hr {
    border: 1.4px dashed $secondary-accent;
    border-radius: $border-r-md;
    position: relative;
    &::after {
      position: absolute;
      content: "1";
      top: 0;
      left: 50%;
      width: 20px;
      height: 20px;
      background-color: $secondary-accent;
      border-radius: 50%;
    }
  }
}
</style>
