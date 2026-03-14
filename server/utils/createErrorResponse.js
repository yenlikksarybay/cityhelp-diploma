export const createErrorResponse = (statusCode, statusMessage, data = {}) => {
	throw createError({
		statusCode,
		statusMessage,
		data,
	});
};
