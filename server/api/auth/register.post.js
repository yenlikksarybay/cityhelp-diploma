import { readBody, createError, setCookie } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { UserModel } from "../../models/User.js";
import { hashPassword } from "../../utils/auth/password.js";
import { createAuthToken } from "../../utils/auth/authToken.js";
import { sanitizeUser } from "../../utils/auth/authResponse.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const body = await readBody(event);
	const { firstName, lastName, email, phone, password, confirmPassword } = body || {};

	if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
		throw createError({ statusCode: 400, statusMessage: "Заполните все обязательные поля" });
	}

	if (password !== confirmPassword) {
		throw createError({ statusCode: 400, statusMessage: "Пароли не совпадают" });
	}

	const normalizedEmail = String(email).trim().toLowerCase();
	const exists = await UserModel.findOne({
		$or: [{ email: normalizedEmail }, { phone: String(phone).trim() }],
	});

	if (exists) {
		throw createError({ statusCode: 409, statusMessage: "Пользователь уже существует" });
	}

	const user = await UserModel.create({
		firstName: String(firstName).trim(),
		lastName: String(lastName).trim(),
		email: normalizedEmail,
		phone: String(phone).trim(),
		passwordHash: hashPassword(password),
		role: "user",
	});

	const token = createAuthToken({ sub: String(user._id), role: user.role, email: user.email });
	setCookie(event, "token", token, { httpOnly: false, sameSite: "lax", path: "/" });

	return createSuccessResponse({
		message: "Регистрация успешна",
		data: {
			token,
			user: sanitizeUser(user),
		},
	});
});
