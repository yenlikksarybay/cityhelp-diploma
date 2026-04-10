import { readBody, createError, getCookie, getHeader } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { AppealModel } from "../../models/Appeal.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";
import { appealAiService } from "../../services/appealAiService.js";

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

const parseDeadlineDate = (deadlineDate) => {
	const value = String(deadlineDate || "").trim();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

	const date = new Date(`${value}T23:59:59.999Z`);
	return Number.isNaN(date.getTime()) ? null : date;
};

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	const body = await readBody(event);
	const description = String(body?.description || "").trim();
	const location = normalizeLocation(body?.location);
	const photos = normalizePhotos(body?.photos);

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

	const appeal = await AppealModel.create({
		user: user._id,
		description,
		photos,
		location,
		category: aiResult.category || "unclassified",
		priority: aiResult.priority || "medium",
		status: aiResult.status || "moderation",
		deadlineAt: parseDeadlineDate(aiResult.deadlineDate),
		assignedEmployee: aiResult.assignedEmployee?.id || null,
		aiResult,
	});

	return createSuccessResponse({
		message: "Обращение создано",
		data: {
			id: String(appeal._id),
			description: appeal.description,
			photos: appeal.photos,
			location: appeal.location,
			category: appeal.category,
			priority: appeal.priority,
			status: appeal.status,
			deadlineAt: appeal.deadlineAt,
			deadlineDate: appeal.deadlineAt ? appeal.deadlineAt.toISOString().slice(0, 10) : null,
			assignedEmployee: appeal.assignedEmployee ? String(appeal.assignedEmployee) : null,
			aiResult: appeal.aiResult,
			createdAt: appeal.createdAt,
		},
	});
});
