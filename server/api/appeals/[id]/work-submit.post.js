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

const normalizeLocation = (location) => {
	if (!location || typeof location !== "object") return null;
	const x = Number(location.x);
	const y = Number(location.y);

	if (!Number.isFinite(x) || !Number.isFinite(y)) {
		return null;
	}

	return {
		x,
		y,
		address: String(location.address || "").trim(),
		label: String(location.label || "").trim(),
	};
};

const normalizeImages = (images = []) => {
	return (Array.isArray(images) ? images : [])
		.map((image) => {
			if (!image) return null;

			const url = String(image.url || "").trim();
			if (!url) return null;

			return {
				url,
				pathname: String(image.pathname || "").trim(),
				name: String(image.name || "").trim(),
				type: String(image.type || "").trim(),
				size: Number(image.size || 0),
			};
		})
		.filter(Boolean)
		.slice(0, 5);
};

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);

	if (user.role !== "employee") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const id = event.context.params?.id;
	const body = await readBody(event);
	const appeal = await AppealModel.findById(id);

	if (!appeal) {
		throw createError({ statusCode: 404, statusMessage: "Обращение не найдено" });
	}

	const isAssigned = String(appeal.assignedEmployee) === String(user._id);
	if (!isAssigned) {
		throw createError({ statusCode: 403, statusMessage: "Это обращение не назначено вам" });
	}

	if (!["processing", "needs_revision"].includes(appeal.status)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Сначала примите обращение в работу",
		});
	}

	const fixedImages = normalizeImages(body?.fixedImages);
	const employeeNote = String(body?.employeeNote || "").trim();
	const fixedLocation = normalizeLocation(body?.fixedLocation);

	if (fixedImages.length > 5) {
		throw createError({ statusCode: 400, statusMessage: "Можно загрузить не более 5 изображений" });
	}

	if (!employeeNote) {
		throw createError({ statusCode: 400, statusMessage: "Добавьте комментарий сотрудника" });
	}

	if (!fixedImages.length) {
		throw createError({ statusCode: 400, statusMessage: "Добавьте хотя бы одно фото результата" });
	}

	if (fixedLocation) {
		appeal.fixedLocation = fixedLocation;
	}

	appeal.fixedImages = fixedImages;
	appeal.employeeNote = employeeNote;
	appeal.status = "moderation";
	appeal.timeline = [
		...(appeal.timeline || []),
		createAppealTimelineEntry({
			type: "employee_work",
			role: user.role,
			authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Сотрудник",
			title: "Работа передана на проверку",
			text: employeeNote,
			statusFrom: "processing",
			statusTo: "moderation",
			meta: {
				fixedImagesCount: fixedImages.length,
				hasFixedLocation: Boolean(fixedLocation),
			},
		}),
	];
	await appeal.save();

	return createSuccessResponse({
		message: "Результат работы отправлен на проверку",
		data: {
			id: String(appeal._id),
			status: appeal.status,
			employeeNote: appeal.employeeNote,
			fixedLocation: appeal.fixedLocation,
			fixedImages: appeal.fixedImages,
			updatedAt: appeal.updatedAt,
		},
	});
});
