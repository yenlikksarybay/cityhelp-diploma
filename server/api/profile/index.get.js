import connectToDatabase from "../../config/mongoDB.js";
import { getAuthUser } from "../../utils/auth/getAuthUser.js";
import { sanitizeUser } from "../../utils/auth/authResponse.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);

	return createSuccessResponse({
		message: "Профиль получен",
		data: sanitizeUser(user),
	});
});
