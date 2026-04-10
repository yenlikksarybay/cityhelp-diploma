export async function useFetchClient(options = {}) {
	const authStore = useAuthStore()


	const headers = {
		Accept: "application/json",
		// "Content-Type": options?.content_type || "application/json",
		"X-Localization": options.locale,
		"Authorization": `Bearer ${authStore.getToken || ""}`,
		...options?.headers,
	};

	try {
		const response = await $fetch(options.url, {
			body: options?.data || options?.body,
			method: options?.method || "get",
			baseURL: options.baseURL,
			params: options?.params || options?.query,
			headers,
		});

		return response;

	} catch (error) {
		if (error?.response?.status === 401) {
			authStore.logout({ type: 'local' })
		}
		const normalizedError = error?.response || {
			statusCode: error?.status || 500,
			statusMessage: error?.statusMessage || error?.message || "Ошибка запроса",
			data: error?.data || {},
		}
		throw normalizedError;
	}
};
