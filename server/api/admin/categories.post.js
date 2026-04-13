import { getCookie, getHeader, createError, readBody } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { CategoryModel } from "../../models/Category.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

const getAuthUser = async (event) => {
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
	return user;
};

const normalizeSubcategories = (value) => {
	if (Array.isArray(value)) {
		return value.map((item) => String(item || "").trim()).filter(Boolean);
	}
	return String(value || "")
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
};

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	if (user.role !== "admin" && user.role !== "superadmin") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const body = await readBody(event);
	const name = String(body?.name || "").trim();
	if (!name) {
		throw createError({ statusCode: 400, statusMessage: "Введите название категории" });
	}

	const category = await CategoryModel.create({
		key: String(body?.key || name.toLowerCase().replace(/\s+/g, "-")).trim(),
		name,
		description: String(body?.description || "").trim(),
		subcategories: normalizeSubcategories(body?.subcategories),
		order: Number(body?.order || 0),
		isActive: Boolean(body?.isActive ?? true),
	});

	return createSuccessResponse({
		message: "Категория создана",
		data: {
			id: String(category._id),
			key: category.key,
			name: category.name,
			description: category.description,
			subcategories: category.subcategories,
			order: category.order,
			isActive: category.isActive,
		},
	});
});
