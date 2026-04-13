import { getCookie, getHeader, createError } from "h3";
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

	if (user.role !== "employee") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const id = event.context.params?.id;
	const appeal = await AppealModel.findById(id);

	if (!appeal) {
		throw createError({ statusCode: 404, statusMessage: "Обращение не найдено" });
	}

	const isAssigned = String(appeal.assignedEmployee) === String(user._id);
	if (!isAssigned) {
		throw createError({ statusCode: 403, statusMessage: "Это обращение не назначено вам" });
	}

	if (appeal.status !== "new") {
		throw createError({ statusCode: 400, statusMessage: "Обращение уже завершено" });
	}

	appeal.status = "processing";
	appeal.timeline = [
		...(appeal.timeline || []),
		createAppealTimelineEntry({
			type: "employee_accept",
			role: user.role,
			authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Сотрудник",
			title: "Обращение принято в работу",
			text: "Сотрудник подтвердил, что приступает к выполнению",
			statusFrom: "new",
			statusTo: "processing",
		}),
	];
	await appeal.save();

	return createSuccessResponse({
		message: "Обращение принято в работу",
		data: {
			id: String(appeal._id),
			status: appeal.status,
			updatedAt: appeal.updatedAt,
		},
	});
});
