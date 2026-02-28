export function useNotify({ title, text, status }) {
	const notifyStore = useNotifyStore()
	notifyStore.addNotification({ title, text, status })
}
