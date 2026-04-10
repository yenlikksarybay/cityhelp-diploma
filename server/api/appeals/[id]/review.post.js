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

	if (user.role !== "admin" && user.role !== "superadmin") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const id = event.context.params?.id;
	const body = await readBody(event);
	const appeal = await AppealModel.findById(id);

	if (!appeal) {
		throw createError({ statusCode: 404, statusMessage: "Обращение не найдено" });
	}

	if (appeal.status !== "moderation") {
		throw createError({
			statusCode: 400,
			statusMessage: "На проверку можно отправлять только готовую работу",
		});
	}

	const isOk = Boolean(body?.isOk);
	const note = String(body?.note || "").trim();

	if (isOk) {
		appeal.status = "completed";
		appeal.moderationNote = note;
	} else {
		appeal.status = "needs_revision";
		appeal.moderationNote = note || "Нужно доработать обращение";
	}

	await appeal.save();

	return createSuccessResponse({
		message: "Проверка сохранена",
		data: {
			id: String(appeal._id),
			status: appeal.status,
			moderationNote: appeal.moderationNote,
			updatedAt: appeal.updatedAt,
		},
	});
});
