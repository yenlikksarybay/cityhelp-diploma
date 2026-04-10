export const useRoleStore = defineStore("role", () => {
	const authStore = useAuthStore()
	const user = computed(() => authStore.getUser)

	const role = computed(() => user.value?.role)

	const isSuperAdmin = computed(() => role.value === 'superadmin' || false)
	const isAdmin = computed(() => role.value === 'admin' || false)
	const isEmployee = computed(() => role.value === 'employee' || false)
	const isUser = computed(() => role.value === 'user' || false)

	return {
		isSuperAdmin,
		isAdmin,
		isEmployee,
		isUser
	};
});
