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

		const data = response

		return data;

	} catch (error) {
		console.log(error.response)
		if (error?.response?.status === 401) {
			authStore.logout({ type: 'local' })
		}
		throw error.response;
	}
};
