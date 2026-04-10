<template>
  <div class="profile" ref="profileRef" @click="setDropdown(!isOpenDropdown)">
    <div class="profile__wrapper">
      <img
        class="profile__avatar"
        v-if="false"
        src=""
        alt="Daryn Bagdar User"
      />
      <div v-else class="profile__avatar profile__avatar--default">
        {{ user.name?.trim().split(" ")[0].charAt(0) || "" }}
      </div>

      <div class="profile__user">
        <p class="profile__name">{{ user.name }}</p>
        <p class="profile__name profile__name--mobile">
          {{ user.name?.trim().split(" ")[0] || "" }}
        </p>
        <p class="profile__role">{{ user.role }}</p>
      </div>

      <transition name="profile-nav">
        <ul class="profile__list" v-show="isOpenDropdown">
          <li
            class="profile__li"
            v-for="list in profileList"
            :key="list.id"
            @click="redirectTo(list)"
          >
            <UiIcon :icon="list.icon" size="size-24" />
            <p class="profile__li-text">{{ list.name }}</p>
          </li>
        </ul>
      </transition>
    </div>
  </div>
  <div v-if="false" class="auth"></div>
</template>

<script setup>
const authStore = useAuthStore();
const user = computed(() => authStore.getUser || {});
const router = useRouter();
const profileRef = ref(null);
const isOpenDropdown = ref(false);
const profileList = [
  // {
  //   id: 1,
  //   name: "Профиль",
  //   icon: "user-i",
  //   route: "/profile/edit",
  // },
  {
    id: 3,
    name: "Выйти",
    icon: "logout-i",
    route: "/",
  },
];

const setDropdown = (boolean) => {
  isOpenDropdown.value = boolean;
};

const redirectTo = (list) => {
  if (list.id === 3) {
    authStore.logout({ type: "auth" });
  } else {
    router.push(list.route);
  }
};

const handleClickOutside = (event) => {
  if (profileRef.value && !profileRef.value.contains(event.target)) {
    setDropdown(false);
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
.profile {
  &__wrapper {
    display: flex;
    align-items: center;
    gap: $gap-sm;
    border: 1px solid $surface-200;
    padding: $padding-md;
    width: 100%;
    border-radius: $border-r-md;
    box-shadow: $box-shadow;
    cursor: pointer;
    position: relative;
    width: 100%;
  }
  &__avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
    &--default {
      display: flex;
      justify-content: center;
      align-items: center;
      color: $white;
      background-color: $secondary-accent;
    }
  }
  &__name {
    font-weight: 500;
    &--mobile {
      display: none;
    }
  }
  &__role {
    font-size: 14px;
    color: $surface-400;
  }
  &__list {
    position: absolute;
    z-index: 2;
    width: inherit;
    top: 101%;
    left: 0;
    display: flex;
    flex-direction: column;
    background-color: $white;
    box-shadow: $box-shadow;
    border-radius: $border-r-md;
  }
  &__li {
    display: flex;
    padding: $padding-sm;
    gap: $gap-sm;
    align-items: center;
    cursor: pointer;
    font-weight: 300;
    font-size: 14px;
    &:first-child {
      border-bottom: 1px solid $surface-150;
    }
    &:hover {
      border-radius: $border-r-md;
      background-color: $surface-150;
    }
  }
}

.profile-nav-enter-active {
  transition: all 0.3s ease-out;
}

.profile-nav-leave-active {
  transition: all 0.3s linear;
}

.profile-nav-enter-from,
.profile-nav-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .profile {
    &__wrapper {
      padding: $padding-xs;
    }
    &__name {
      display: none;
      &--mobile {
        font-size: 14px;
        display: block;
      }
    }
    &__role {
      font-size: 12px;
    }
  }
}
</style>
