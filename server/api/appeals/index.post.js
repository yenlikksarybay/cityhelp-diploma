import { readBody, createError, getCookie, getHeader } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { AppealModel } from "../../models/Appeal.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";
import { appealAiService } from "../../services/appealAiService.js";
import mongoose from "mongoose";
import { createAppealTimelineEntry } from "../../utils/appealTimeline.js";

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

const normalizeLocation = (location) => {
	if (!location || typeof location !== "object") return null;
	const x = Number(location.x);
	const y = Number(location.y);
	if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
	return {
		x,
		y,
		address: String(location.address || "").trim(),
		label: String(location.label || "").trim(),
	};
};

const normalizePhotos = (photos = []) => {
	return (Array.isArray(photos) ? photos : [])
		.map((photo) => {
			if (!photo) return null;
			if (typeof photo === "string") {
				return {
					url: photo,
					pathname: "",
					name: "",
					type: "",
					size: 0,
				};
			}

			const url = String(photo.url || "").trim();
			if (!url) return null;

			return {
				url,
				pathname: String(photo.pathname || "").trim(),
				name: String(photo.name || "").trim(),
				type: String(photo.type || "").trim(),
				size: Number(photo.size || 0),
			};
		})
		.filter(Boolean)
		.slice(0, 5);
};

const parseDeadlineAt = (deadlineAt) => {
	const value = String(deadlineAt || "").trim();
	if (!value) return null;

	const normalized = value.includes("T") ? value : value.replace(" ", "T");
	const date = new Date(normalized);
	return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeAppealId = (value) => {
	const normalized = String(value || "").trim();
	return mongoose.Types.ObjectId.isValid(normalized) ? normalized : null;
};

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	const body = await readBody(event);
	const description = String(body?.description || "").trim();
	const location = normalizeLocation(body?.location);
	const photos = normalizePhotos(body?.photos);
	const appealId = normalizeAppealId(body?.appealId);

	if (!description || description.length < 20) {
		throw createError({ statusCode: 400, statusMessage: "Описание должно содержать минимум 20 символов" });
	}

	if (!location) {
		throw createError({ statusCode: 400, statusMessage: "Укажите место на карте" });
	}

	if (!photos.length) {
		throw createError({ statusCode: 400, statusMessage: "Добавьте хотя бы одну фотографию" });
	}

	if (photos.length > 5) {
		throw createError({ statusCode: 400, statusMessage: "Можно добавить не более 5 фотографий" });
	}

	const aiResult = await appealAiService.analyzeAppeal({
		description,
		location,
		photos,
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

	const appeal = await AppealModel.create({
		...(appealId ? { _id: new mongoose.Types.ObjectId(appealId) } : {}),
		user: user._id,
		description,
		photos,
		location,
		category: aiResult.category || "unclassified",
		subCategory: aiResult.subCategory || "",
		priority: aiResult.priority || "medium",
		status: "moderation",
		deadlineAt: parseDeadlineAt(aiResult.deadlineAt || aiResult.deadlineDate),
		assignedEmployee: aiResult.assignedEmployee?.id || null,
		aiResult: normalizedAiResult,
		timeline: [
			createAppealTimelineEntry({
				type: "ai_analysis",
				role: "ai",
				authorName: "CityHelp AI",
				title: "Автоматический анализ",
				text: normalizedAiResult.shortSummary || description,
				statusTo: "moderation",
				meta: {
					category: normalizedAiResult.category || "unclassified",
					subCategory: normalizedAiResult.subCategory || "",
					priority: normalizedAiResult.priority || "medium",
					deadlineAt: normalizedAiResult.deadlineAt || normalizedAiResult.deadlineDate || null,
					assignedEmployee: normalizedAiResult.assignedEmployee || null,
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
		],
	});

	return createSuccessResponse({
		message: "Обращение создано",
		data: {
			id: String(appeal._id),
			description: appeal.description,
			photos: appeal.photos,
			location: appeal.location,
			category: appeal.category,
			subCategory: appeal.subCategory,
			priority: appeal.priority,
			status: appeal.status,
			deadlineAt: appeal.deadlineAt ? appeal.deadlineAt.toISOString().slice(0, 16).replace("T", " ") : null,
			assignedEmployee: appeal.assignedEmployee ? String(appeal.assignedEmployee) : null,
			aiResult: appeal.aiResult,
			timeline: appeal.timeline,
			createdAt: appeal.createdAt,
		},
	});
});
