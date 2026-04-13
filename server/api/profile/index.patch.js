import { readBody, createError } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { getAuthUser } from "../../utils/auth/getAuthUser.js";
import { sanitizeUser } from "../../utils/auth/authResponse.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	const body = await readBody(event);

	if (Object.prototype.hasOwnProperty.call(body || {}, "email") || Object.prototype.hasOwnProperty.call(body || {}, "phone")) {
		throw createError({
			statusCode: 400,
			statusMessage: "Телефон и email изменить нельзя",
		});
	}

	const firstName = String(body?.firstName || "").trim();
	const lastName = String(body?.lastName || "").trim();

	if (!firstName || !lastName) {
		throw createError({ statusCode: 400, statusMessage: "Заполните имя и фамилию" });
	}

	user.firstName = firstName;
	user.lastName = lastName;
	await user.save();

	return createSuccessResponse({
		message: "Профиль обновлён",
		data: sanitizeUser(user),
	});
});
