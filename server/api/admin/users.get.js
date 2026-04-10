import { getQuery, createError, getHeader, getCookie } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { sanitizeUser } from "../../utils/auth/authResponse.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

const ALLOWED_ROLES = ["user", "employee"];

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

	if (user.role !== "admin" && user.role !== "superadmin") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const query = getQuery(event);
	const role = String(query.role || "user").toLowerCase();
	const search = String(query.search || "").trim();

	if (!ALLOWED_ROLES.includes(role)) {
		throw createError({ statusCode: 400, statusMessage: "Некорректная роль" });
	}

	const filter = { role };

	if (search) {
		filter.$or = [
			{ firstName: { $regex: search, $options: "i" } },
			{ lastName: { $regex: search, $options: "i" } },
			{ phone: { $regex: search, $options: "i" } },
		];
	}

	const users = await UserModel.find(filter).sort({ createdAt: -1 });

	return createSuccessResponse({
		message: "Список пользователей получен",
		data: users.map(sanitizeUser),
		meta: {
			total: users.length,
			role,
			search,
		},
	});
});
