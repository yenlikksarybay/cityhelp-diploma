export const useNotifyStore = defineStore('notify', () => {
	const notifications = ref([]);
	const counter = ref(1);

	const addNotification = (notification) => {
		counter.value++;
		notifications.value.push({ ...notification, id: counter.value });
	};

	const removeNotification = (id) => {
		const index = notifications.value.findIndex(item => item.id === id);
		if (index !== -1) {
			notifications.value.splice(index, 1);
		}
	};

	const cleaningNotification = (id) => {
		setTimeout(() => {
			removeNotification(id);
		}, 5000);
	};

	watch(() => counter.value, () => {
		cleaningNotification(counter.value)
	})

	return {
		notifications, addNotification, counter
	};
});
