export const useRoleStore = defineStore("role", () => {
	const authStore = useAuthStore()
	const user = computed(() => authStore.getUser)

	const isAdmin = computed(() => user.value?.role?.id === 'admin' || false)
	const isEmployee = computed(() => user.value?.role?.id === 'employee' || false)
	const isUser = computed(() => user.value?.role?.id === 'user' || false)

	return {
		isAdmin,
		isEmployee,
		isUser
	};
});
