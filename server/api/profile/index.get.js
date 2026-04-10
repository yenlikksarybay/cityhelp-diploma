import { getCookie, getHeader, createError } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { sanitizeUser } from "../../utils/auth/authResponse.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const header = getHeader(event, "authorization");
	const token = header?.startsWith("Bearer ") ? header.slice(7) : getCookie(event, "token");
	const payload = verifyAuthToken(token);

	if (!payload?.sub) {
		throw createError({ statusCode: 401, statusMessage: "Не авторизован" });
	}

	const user = await UserModel.findById(payload.sub);
	if (!user) {
		throw createError({ statusCode: 401, statusMessage: "Не авторизован" });
	}

	return createSuccessResponse({
		message: "Профиль получен",
		data: sanitizeUser(user),
	});
});
