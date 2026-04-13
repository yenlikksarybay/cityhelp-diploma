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

	const normalizedAiResult = {
		...aiResult,
		status: "moderation",
		decision: {
			categoryReason: String(aiResult.categoryReason || "").trim(),
			priorityReason: String(aiResult.priorityReason || "").trim(),
			deadlineReason: String(aiResult.deadlineReason || "").trim(),
			locationReason: String(aiResult.locationReason || "").trim(),
			statusReason: String(aiResult.statusReason || "").trim(),
			assignedEmployeeReason: String(aiResult.assignedEmployeeReason || "").trim(),
			analysisSummary: String(aiResult.analysisSummary || "").trim(),
			evidence: Array.isArray(aiResult.evidence) ? aiResult.evidence : [],
			uncertainties: Array.isArray(aiResult.uncertainties) ? aiResult.uncertainties : [],
			assumptions: Array.isArray(aiResult.assumptions) ? aiResult.assumptions : [],
			subCategoryReason: String(aiResult.subCategoryReason || "").trim(),
			confidenceCategory: Number(aiResult.confidenceCategory || 0),
			confidencePriority: Number(aiResult.confidencePriority || 0),
			confidencePhoto: Number(aiResult.confidencePhoto || 0),
			confidenceLevel: String(aiResult.confidenceLevel || ""),
			needsCarefulReview: Boolean(aiResult.needsCarefulReview),
			candidateCategories: Array.isArray(aiResult.candidateCategories) ? aiResult.candidateCategories : [],
		},
	};

	const previousEmployeeId = appeal.assignedEmployee ? String(appeal.assignedEmployee) : "";
	const nextEmployeeId = aiResult.assignedEmployee?.id ? String(aiResult.assignedEmployee.id) : "";

	appeal.category = aiResult.category || appeal.category;
	appeal.subCategory = aiResult.subCategory || appeal.subCategory || "";
	appeal.priority = aiResult.priority || appeal.priority;
	appeal.deadlineAt = aiResult.deadlineAt ? new Date(aiResult.deadlineAt.replace(" ", "T")) : appeal.deadlineAt;
	appeal.assignedEmployee = nextEmployeeId || appeal.assignedEmployee || null;
	appeal.aiResult = normalizedAiResult;
	appeal.timeline = [
		...(appeal.timeline || []),
		createAppealTimelineEntry({
			type: "ai_recheck",
			role: "ai",
			authorName: "AI CityHelp",
			title: "AI перепроверил обращение",
			text: normalizedAiResult.shortSummary || "Обращение повторно проанализировано",
			statusFrom: "moderation",
			statusTo: "moderation",
			meta: {
				category: normalizedAiResult.category || "",
				priority: normalizedAiResult.priority || "",
				deadlineAt: normalizedAiResult.deadlineAt || normalizedAiResult.deadlineDate || null,
				assignedEmployee: normalizedAiResult.assignedEmployee || null,
				previousAssignedEmployee: previousEmployeeId || null,
				nextAssignedEmployee: nextEmployeeId || null,
				categoryReason: normalizedAiResult.decision.categoryReason,
				subCategoryReason: normalizedAiResult.decision.subCategoryReason,
				priorityReason: normalizedAiResult.decision.priorityReason,
				deadlineReason: normalizedAiResult.decision.deadlineReason,
				statusReason: normalizedAiResult.decision.statusReason,
				assignedEmployeeReason: normalizedAiResult.decision.assignedEmployeeReason,
				analysisSummary: normalizedAiResult.decision.analysisSummary,
				evidence: normalizedAiResult.decision.evidence,
				uncertainties: normalizedAiResult.decision.uncertainties,
				assumptions: normalizedAiResult.decision.assumptions,
				confidenceCategory: normalizedAiResult.decision.confidenceCategory,
				confidencePriority: normalizedAiResult.decision.confidencePriority,
				confidencePhoto: normalizedAiResult.decision.confidencePhoto,
				confidenceLevel: normalizedAiResult.decision.confidenceLevel,
				needsCarefulReview: normalizedAiResult.decision.needsCarefulReview,
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
