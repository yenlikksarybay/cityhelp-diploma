import { readBody, getCookie, getHeader, createError } from "h3";
import connectToDatabase from "../../../config/mongoDB.js";
import { AppealModel } from "../../../models/Appeal.js";
import { UserModel } from "../../../models/User.js";
import { verifyAuthToken } from "../../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";
import { createAppealTimelineEntry } from "../../../utils/appealTimeline.js";
import { createAiTrainingCase, createDecisionSnapshot } from "../../../utils/aiTrainingCase.js";

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
			statusMessage: "Проверить можно только обращения в модерации",
		});
	}

	const isOk = Boolean(body?.isOk);
	const note = String(body?.note || "").trim();
	const nextStatus = isOk ? "completed" : "rejected";
	const originalDecision = createDecisionSnapshot(appeal);

	if (isOk && !appeal.assignedEmployee) {
		throw createError({
			statusCode: 400,
			statusMessage: "Нельзя подтвердить модерацию без назначенного сотрудника",
		});
	}

	if (isOk) {
		appeal.status = nextStatus;
		appeal.moderationNote = note;
	} else {
		appeal.status = nextStatus;
		appeal.moderationNote = note || "Обращение отклонено модератором";
	}

	appeal.timeline = [
		...(appeal.timeline || []),
		createAppealTimelineEntry({
			type: "admin_moderation",
			role: user.role,
			authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Администратор",
			title: isOk ? "Модерация подтверждена" : "Обращение отклонено",
			text: note || (isOk ? "AI-результат подтверждён" : "Обращение не прошло проверку"),
			statusFrom: "moderation",
			statusTo: nextStatus,
			meta: {
				note,
				decision: isOk ? "approved" : "rejected",
			},
		}),
	];

	await appeal.save();

	await createAiTrainingCase({
		appeal,
		moderator: user,
		source: "admin_moderation",
		action: isOk ? "approved" : "rejected",
		originalDecision,
		finalDecision: createDecisionSnapshot(appeal),
		correctedFields: ["status", ...(note ? ["moderationNote"] : [])],
		moderatorNote: appeal.moderationNote,
	});

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
