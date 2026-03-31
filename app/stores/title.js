export const useTitleStore = defineStore("title", () => {
	const route = useRoute()
	const title = ref("")
	const activeRoute = ref("")


	const currentTitle = computed(() => title.value)
	const currentActiveRoute = computed(() => activeRoute.value)

	const switchTitle = () => {
		switch (route.path.replace(/^\/[a-z]{2}(?=\/|$)/, '')) {
			// Основные
			case '/panel':
				title.value = "Главная"
				activeRoute.value = '/panel'
				break;
			case '/panel/create-appeal':
				title.value = "Создать обращение"
				activeRoute.value = '/panel/create-appeal'
				break;

			// User
			case '/panel/user/my-appeals':
				title.value = "Мои обращений"
				activeRoute.value = '/panel/user/my-appeals'
				break;

			//Admin
			case '/panel/admin/appeals':
				title.value = "Cписок обращений"
				activeRoute.value = '/panel/admin/appeals'
				break;
			case '/panel/admin/users':
				title.value = "Пользователи"
				activeRoute.value = '/panel/admin/users'
				break;
			case '/panel/admin/staff':
				title.value = "Сотрудники"
				activeRoute.value = '/panel/admin/staff'
				break;
			case '/panel/admin/translations':
				title.value = "Переводы"
				activeRoute.value = '/panel/admin/translations'
				break;
			case '/panel/admin/prompts':
				title.value = "AI Промты"
				activeRoute.value = '/panel/admin/prompts'
				break;

			//Employee
			case '/panel/employee/appeals':
				title.value = "Обращений"
				activeRoute.value = '/panel/employee/appeals'
				break;

			// Общие
			case '/panel/contacts':
				title.value = "Контакты"
				activeRoute.value = '/panel/contacts'
				break;
			case '/panel/about-us':
				title.value = "О 'CityHelp'"
				activeRoute.value = '/panel/about-us'
				break;
		}
	}

	switchTitle()

	const setTitle = (pageTitle, route) => {
		title.value = pageTitle;
		activeRoute.value = route
	};

	watch(() => route.fullPath, () => { switchTitle() }, { immediate: true })

	return {
		currentTitle,
		currentActiveRoute,
		setTitle
	};
});
