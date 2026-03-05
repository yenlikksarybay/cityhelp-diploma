export function formatKzPhone(number) {
	if (!number) return "";

	const digits = number.toString().replace(/\D/g, "");

	if (!/^[78]\d{10}$/.test(digits)) {
		return number;
	}

	return digits.replace(
		/^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/,
		"$1 $2 $3 $4 $5"
	);
}
