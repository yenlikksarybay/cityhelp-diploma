export async function useFetchSsr(options = {}) {
	const authStore = useAuthStore()
	const loaderStore = useLoaderStore()
	const config = useRuntimeConfig();

	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		"Authorization": `Bearer ${authStore.getToken || null}`,
		...options?.headers,
	};

	loaderStore.setLoader(true)

	try {
		const response = await useFetch(options.url, {
			body: options?.data || options?.body,
			method: options?.method || "get",
			baseURL: config.public.baseURL,
			params: options?.params || options?.query,
			headers,
		});

		const data = response.data?.value
		const error = response?.error.value

		loaderStore.setLoader(false)


		if (error) { throw error }

		return data;

	} catch (error) {
		loaderStore.setLoader(false)
		console.log(error)
		if (error?.statusCode === 401 || error?.data?.message === "Unauthenticated") {
			authStore.logout({ type: 'local' })
		}
		throw error;
	}
};
