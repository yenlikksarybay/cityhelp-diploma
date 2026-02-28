export const useApi = defineStore("api", () => {
	const config = useRuntimeConfig();

	const client = async (options = {}) => {
		return await useFetchClient({ ...options, baseURL: config.public.baseURL })
	}

	const ssr = async (options = {}) => {
		return await useFetchSsr({ ...options, baseURL: config.public.baseURL })
	}
	return {
		client,
		ssr
	};
});
