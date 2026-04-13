import { readBody, getCookie, getHeader, createError } from "h3";
import connectToDatabase from "../../../config/mongoDB.js";
import { AppealModel } from "../../../models/Appeal.js";
import { UserModel } from "../../../models/User.js";
import { verifyAuthToken } from "../../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";
import { createAppealTimelineEntry } from "../../../utils/appealTimeline.js";

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

	if (user.role !== "admin" && user.role !== "superadmin") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	if (appeal.status !== "moderation") {
		throw createError({
			statusCode: 400,
			statusMessage: "Финальную проверку можно делать только после отправки сотрудником",
		});
	}

	const isOk = Boolean(body?.isOk);
	const note = String(body?.note || "").trim();
	const nextStatus = isOk ? "completed" : "needs_revision";

	appeal.status = nextStatus;
	appeal.moderationNote = note || (isOk ? "Обращение завершено" : "Нужно доработать обращение");
	appeal.timeline = [
		...(appeal.timeline || []),
		createAppealTimelineEntry({
			type: "admin_final_check",
			role: user.role,
			authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Администратор",
			title: isOk ? "Проверка завершена" : "Отправлено на доработку",
			text: note || (isOk ? "Выполнение подтверждено" : "Требуется доработка"),
			statusFrom: "moderation",
			statusTo: nextStatus,
			meta: {
				note,
				decision: isOk ? "approved" : "needs_revision",
			},
		}),
	];

	await appeal.save();

	return createSuccessResponse({
		message: "Финальная проверка сохранена",
		data: {
			id: String(appeal._id),
			status: appeal.status,
			moderationNote: appeal.moderationNote,
			updatedAt: appeal.updatedAt,
		},
	});
});
