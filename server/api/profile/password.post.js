import { readBody, createError } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { getAuthUser } from "../../utils/auth/getAuthUser.js";
import { verifyPassword, hashPassword } from "../../utils/auth/password.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event, { select: "+passwordHash" });
	const body = await readBody(event);

	const oldPassword = String(body?.oldPassword || "").trim();
	const newPassword = String(body?.newPassword || "").trim();
	const confirmPassword = String(body?.confirmPassword || "").trim();

	if (!oldPassword || !newPassword || !confirmPassword) {
		throw createError({
			statusCode: 400,
			statusMessage: "Заполните все поля пароля",
		});
	}

	if (newPassword.length < 8) {
		throw createError({
			statusCode: 400,
			statusMessage: "Новый пароль должен содержать минимум 8 символов",
		});
	}

	if (newPassword !== confirmPassword) {
		throw createError({
			statusCode: 400,
			statusMessage: "Пароли не совпадают",
		});
	}

	if (!verifyPassword(oldPassword, user.passwordHash)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Старый пароль неверный",
		});
	}

	user.passwordHash = hashPassword(newPassword);
	await user.save();

	return createSuccessResponse({
		message: "Пароль обновлён",
		data: {
			updated: true,
		},
	});
});
