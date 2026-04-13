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

	if (String(appeal.user) !== String(user._id)) {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	if (appeal.status !== "completed" && appeal.status !== "rated") {
		throw createError({
			statusCode: 400,
			statusMessage: "Оценить можно только завершённое обращение",
		});
	}

	const score = Number(body?.score);
	if (!Number.isFinite(score) || score < 1 || score > 5) {
		throw createError({ statusCode: 400, statusMessage: "Оценка должна быть от 1 до 5" });
	}

	appeal.rating = {
		score,
		comment: String(body?.comment || ""),
		createdAt: new Date(),
	};
	appeal.status = "rated";
	appeal.timeline = [
		...(appeal.timeline || []),
		createAppealTimelineEntry({
			type: "user_rating",
			role: user.role,
			authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Пользователь",
			title: "Пользователь оценил обращение",
			text: String(body?.comment || "").trim() || `Оценка: ${score}`,
			statusFrom: "completed",
			statusTo: "rated",
			meta: {
				score,
			},
		}),
	];
	await appeal.save();

	return createSuccessResponse({
		message: "Оценка сохранена",
		data: {
			id: String(appeal._id),
			rating: appeal.rating,
			status: appeal.status,
		},
	});
});
