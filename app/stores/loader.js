export const useLoaderStore = defineStore("loader", () => {
	const isLoader = ref(false)

	const setLoader = (value) => {
		isLoader.value = value
	};

	return {
		isLoader,
		setLoader
	};
});
