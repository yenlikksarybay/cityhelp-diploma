import { readBody, getCookie, getHeader, createError } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { AppealModel } from "../../models/Appeal.js";
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

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	const id = event.context.params?.id;
	const body = await readBody(event);
	const appeal = await AppealModel.findById(id);

	if (!appeal) {
		throw createError({ statusCode: 404, statusMessage: "Обращение не найдено" });
	}

	const isAdmin = user.role === "admin" || user.role === "superadmin";

	if (!isAdmin) {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const fields = [
		"status",
		"assignedEmployee",
		"moderationNote",
		"category",
		"priority",
		"deadlineAt",
	];

	fields.forEach((field) => {
		if (Object.prototype.hasOwnProperty.call(body || {}, field)) {
			appeal[field] = body[field];
		}
	});

	await appeal.save();

	return createSuccessResponse({
		message: "Обращение обновлено",
		data: {
			id: String(appeal._id),
			status: appeal.status,
			assignedEmployee: appeal.assignedEmployee ? String(appeal.assignedEmployee) : null,
			moderationNote: appeal.moderationNote,
			category: appeal.category,
			priority: appeal.priority,
			deadlineAt: appeal.deadlineAt,
			updatedAt: appeal.updatedAt,
		},
	});
});
