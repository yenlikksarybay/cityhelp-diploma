export function formatDateToDash(value) {
	if (!value) return "";


	if (value instanceof Date) {
		const year = value.getFullYear();
		const month = String(value.getMonth() + 1).padStart(2, "0");
		const day = String(value.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	value = value.replace(/\D/g, "");

	if (value.length <= 4) {
		return value;
	} else if (value.length <= 6) {
		return value.replace(/^(\d{4})(\d{0,2})/, "$1-$2");
	} else {
		return value.replace(/^(\d{4})(\d{2})(\d{0,2}).*/, "$1-$2-$3");
	}
}
