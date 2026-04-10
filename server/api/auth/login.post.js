import { readBody, createError, setCookie } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { UserModel } from "../../models/User.js";
import { verifyPassword } from "../../utils/auth/password.js";
import { createAuthToken } from "../../utils/auth/authToken.js";
import { sanitizeUser } from "../../utils/auth/authResponse.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const body = await readBody(event);
	const { email, password } = body || {};

	if (!email || !password) {
		throw createError({ statusCode: 400, statusMessage: "Введите email и пароль" });
	}

	const user = await UserModel.findOne({ email: String(email).trim().toLowerCase() }).select("+passwordHash");
	if (!user || !verifyPassword(password, user.passwordHash)) {
		throw createError({ statusCode: 401, statusMessage: "Неверный email или пароль" });
	}

	const token = createAuthToken({ sub: String(user._id), role: user.role, email: user.email });
	setCookie(event, "token", token, { httpOnly: false, sameSite: "lax", path: "/" });

	return createSuccessResponse({
		message: "Вход выполнен",
		data: {
			token,
			user: sanitizeUser(user),
		},
	});
});
