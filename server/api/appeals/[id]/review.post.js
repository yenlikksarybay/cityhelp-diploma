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
	const hasEmployeeResult = Boolean(
		appeal.employeeNote ||
		Array.isArray(appeal.fixedImages) && appeal.fixedImages.length > 0 ||
		appeal.fixedLocation,
	);
	const originalDecision = createDecisionSnapshot(appeal);

	let nextStatus;
	let timelineType;
	let timelineTitle;
	let timelineText;
	let decision;

	if (hasEmployeeResult) {
		// Вторая проверка после отправки результата сотрудником
		nextStatus = isOk ? "completed" : "needs_revision";
		timelineType = "admin_final_check";
		timelineTitle = isOk ? "Финальная проверка пройдена" : "Отправлено на доработку";
		timelineText = note || (isOk ? "Выполнение сотрудника подтверждено" : "Требуется доработка");
		decision = isOk ? "approved" : "needs_revision";
	} else {
		// Первая проверка сразу после создания обращения
		nextStatus = isOk ? "new" : "rejected";
		timelineType = "admin_moderation";
		timelineTitle = isOk ? "Обращение передано сотруднику" : "Обращение отклонено";
		timelineText = note || (isOk ? "Обращение отправлено на исполнение" : "Обращение не прошло проверку");
		decision = isOk ? "approved" : "rejected";

		if (isOk && !appeal.assignedEmployee) {
			throw createError({
				statusCode: 400,
				statusMessage: "Нельзя подтвердить модерацию без назначенного сотрудника",
			});
		}
	}

	appeal.status = nextStatus;
	appeal.moderationNote = note || "";

	appeal.timeline = [
		...(appeal.timeline || []),
		createAppealTimelineEntry({
			type: timelineType,
			role: user.role,
			authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Администратор",
			title: timelineTitle,
			text: timelineText,
			statusFrom: "moderation",
			statusTo: nextStatus,
			meta: {
				note,
				decision,
			},
		}),
	];

	await appeal.save();

	await createAiTrainingCase({
		appeal,
		moderator: user,
		source: timelineType,
		action: isOk ? "approved" : decision,
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
