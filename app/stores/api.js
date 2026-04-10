export const useApi = defineStore("api", () => {
	const config = useRuntimeConfig();
	const baseURL = computed(() => config.public.baseURL || "/api");

	const client = async (options = {}) => {
		return await useFetchClient({ ...options, baseURL: baseURL.value })
	}

	const ssr = async (options = {}) => {
		return await useFetchSsr({ ...options, baseURL: baseURL.value })
	}
	return {
		client,
		ssr
	};
});
