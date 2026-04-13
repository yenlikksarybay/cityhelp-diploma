export default defineNuxtRouteMiddleware((to, from) => {
	const authStore = useAuthStore()
	if (!authStore.isAuth) {
		return navigateTo({
			path: '/',
			query: {
				auth: 'login',
				redirect: to.fullPath,
			},
		})
	}
})
