export const useAsideStore = defineStore("aside", () => {
	const isOpen = ref(process.client ? JSON.parse(localStorage.getItem("isOpenAside")) : true);
	const isMobileOpen = ref(false);


	const toggle = () => {
		isOpen.value = !isOpen.value;
		localStorage.setItem("isOpenAside", JSON.stringify(isOpen.value));
	};

	const mobileToggle = () => {
		isMobileOpen.value = !isMobileOpen.value
	}

	const setOpen = (value) => {
		isOpen.value = value;
		localStorage.setItem("isOpenAside", JSON.stringify(value));
	};

	const checkIsOpen = () => {
		isOpen.value = process.client ? JSON.parse(localStorage.getItem("isOpenAside")) : true
	}


	onMounted(() => {
		checkIsOpen()
	})

	return {
		isOpen,
		isMobileOpen,
		toggle,
		setOpen,
		mobileToggle
	};
});
