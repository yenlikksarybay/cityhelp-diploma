<template>
  <transition-group
    v-if="notifications?.length"
    name="notification"
    tag="div"
    class="notifications-queue"
    :class="{ 'notifications-queue--hide': !notifications.length }"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="['notification', notification.status]"
    >
      <span
        class="notification__icon"
        v-if="notification.status"
        :class="
          notification.status === 'success'
            ? 'notification__icon--success'
            : 'notification__icon--error'
        "
      >
        <UiIcon
          :icon="
            notification.status === 'success' ? 'checkmark' : 'error-notify'
          "
          :size="notification.status === 'success' ? 'size-20' : 'size-24'"
          color="white"
        />
      </span>

      <div class="notification__content">
        <h3 v-if="notification.title" class="notification__title">
          {{ notification.title }}
        </h3>
        <p v-html="notification.text" class="notification__text"></p>
      </div>
    </div>
  </transition-group>
</template>

<script setup>
const notifyStore = useNotifyStore();
const notifications = ref(notifyStore.notifications);
</script>

<style lang="scss" scoped>
.notifications-queue {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-height: 60px;
  max-width: 300px;
  width: 100%;
  &--hide {
    z-index: -1;
  }
}

.notification {
  display: flex;
  align-items: center;
  padding: $padding-sm;
  margin: 6px 0;
  border-radius: $border-r-xl;
  backdrop-filter: blur(10px);
  background-color: hsla(0, 0%, 100%, 0.8);
  transition: opacity 1s ease;
  min-height: 60px;
  max-width: 300px;
  width: 100%;
  -webkit-box-shadow: 0px 1px 14px 1px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 1px 14px 1px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 1px 14px 1px rgba(34, 60, 80, 0.2);

  &__icon {
    margin-right: 10px;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    &--success {
      padding: $padding-sm;
      background-color: $green-500;
      border-radius: 12px;
    }
    &--error {
      padding: $padding-sm;
      background-color: $red-300;
      border-radius: $border-r-xl;
    }
  }

  &__title {
    font-size: 15px;
    color: black;
    margin: 0 0 5px;
  }

  &__text {
    color: $surface-600;
    font-size: 14px;
  }
}

// .notification-enter-active,
// .notification-leave-active {
//   transition: all 0.2s ease;
// }

// .notification-enter-from {
//   transform: translateY(100%);
//   opacity: 0;
// }

// .notification-enter-to {
//   transform: translateY(0);
//   opacity: 1;
// }

// .notification-leave-from {
//   transform: translateY(0);
//   opacity: 1;
// }

// .notification-leave-to {
//   transform: translateY(50%);
//   opacity: 0;
// }

.notification-move,
.notification-enter-active,
.notification-leave-active {
  transition: all 1s ease;
}

.notification-leave-active {
  position: absolute;
}

.notification-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.notification-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.notification-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.notification-leave-to {
  transform: translateY(-50%);
  opacity: 0;
}
</style>
