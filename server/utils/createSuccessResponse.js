export const createSuccessResponse = ({
	success = true,
	message = "OK",
	data = null,
	meta = {},
} = {}) => {
	return {
		success,
		message,
		data,
		meta,
	};
};
