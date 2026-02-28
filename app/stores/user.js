export const useAuthStore = defineStore('auth', () => {
	const token = useCookie('token', { maxAge: 60 * 60 * 24 * 7 }) // 7 дней
	const user = useCookie('user', { maxAge: 60 * 60 * 24 * 7 })

	const isAuth = computed(() => !!(token.value && user.value))
	const isToken = computed(() => !!token.value)
	const getToken = computed(() => token.value)
	const getUser = computed(() => user.value)

	const router = useRouter()

	const setUser = async (path) => {
		try {
			await useApi().client({ url: '/profile', method: 'get' }).then(res => {
				user.value = res
				if (path) { router.push(path) }
			})
		} catch (err) {
			logout({ type: 'local' })
			router.push('/')
		}
	}

	const setToken = async (payload, path = null) => {
		token.value = payload
		await setUser(path)
	}

	const logout = async ({ type = 'auth' }) => {
		if (type === 'auth') {
			await useApi().client({ url: "/auth/logout", method: 'post' })
			token.value = null
			user.value = null
			router.push('/')
		}
		else if (type === "local") {
			token.value = null
			user.value = null
			useNotify({ title: 'Ой', text: 'Сессия истекла', status: "error" })
			// router.push('/')
		}
	}

	return {
		user,
		token,
		isAuth,
		isToken,
		getToken,
		getUser,
		setToken,
		setUser,
		logout,
	}
})
