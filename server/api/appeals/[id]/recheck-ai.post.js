import { getCookie, getHeader, createError } from "h3";
import connectToDatabase from "../../../config/mongoDB.js";
import { AppealModel } from "../../../models/Appeal.js";
import { UserModel } from "../../../models/User.js";
import { verifyAuthToken } from "../../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";
import { createAppealTimelineEntry } from "../../../utils/appealTimeline.js";
import { appealAiService } from "../../../services/appealAiService.js";

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
	const appeal = await AppealModel.findById(id);

	if (!appeal) {
		throw createError({ statusCode: 404, statusMessage: "Обращение не найдено" });
	}

	if (appeal.status !== "moderation") {
		throw createError({
			statusCode: 400,
			statusMessage: "Перепроверка AI доступна только на модерации",
		});
	}

	const aiResult = await appealAiService.analyzeAppeal({
		description: appeal.description,
		location: appeal.location,
		photos: appeal.photos,
	});

	appeal.aiResult = {
		...aiResult,
		status: "moderation",
	};
	appeal.timeline = [
		...(appeal.timeline || []),
		createAppealTimelineEntry({
			type: "ai_recheck",
			role: "ai",
			authorName: "AI CityHelp",
			title: "AI перепроверил обращение",
			text: aiResult.shortSummary || "Обращение повторно проанализировано",
			statusFrom: "moderation",
			statusTo: "moderation",
			meta: {
				category: aiResult.category || "",
				priority: aiResult.priority || "",
				deadlineDate: aiResult.deadlineDate || null,
				assignedEmployee: aiResult.assignedEmployee || null,
			},
		}),
	];

	await appeal.save();

	return createSuccessResponse({
		message: "AI перепроверил обращение",
		data: {
			id: String(appeal._id),
			status: appeal.status,
			aiResult: appeal.aiResult,
			updatedAt: appeal.updatedAt,
		},
	});
});
