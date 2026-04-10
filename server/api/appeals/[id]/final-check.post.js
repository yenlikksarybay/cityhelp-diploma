import { readBody, getCookie, getHeader, createError } from "h3";
import connectToDatabase from "../../../config/mongoDB.js";
import { AppealModel } from "../../../models/Appeal.js";
import { UserModel } from "../../../models/User.js";
import { verifyAuthToken } from "../../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

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

	if (user.role !== "employee" && user.role !== "admin" && user.role !== "superadmin") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const isOk = Boolean(body?.isOk);
	if (isOk) {
		appeal.status = "completed";
		appeal.employeeNote = String(body?.note || appeal.employeeNote || "");
	} else {
		appeal.status = "needs_revision";
		appeal.employeeNote = String(body?.note || "Нужно доработать обращение");
	}

	await appeal.save();

	return createSuccessResponse({
		message: "Финальная проверка сохранена",
		data: {
			id: String(appeal._id),
			status: appeal.status,
			employeeNote: appeal.employeeNote,
			updatedAt: appeal.updatedAt,
		},
	});
});
