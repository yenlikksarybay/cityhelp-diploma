import { readBody, getCookie, getHeader, createError } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { AppealModel } from "../../models/Appeal.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";
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

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	const id = event.context.params?.id;
	const body = await readBody(event);
	const appeal = await AppealModel.findById(id);

	if (!appeal) {
		throw createError({ statusCode: 404, statusMessage: "Обращение не найдено" });
	}

	const isAdmin = user.role === "admin" || user.role === "superadmin";
	const isOwner = String(appeal.user) === String(user._id);
	const canEdit = appeal.status === "moderation" && (isAdmin || isOwner);

	if (!canEdit) {
		throw createError({ statusCode: 403, statusMessage: "Редактирование доступно только на модерации" });
	}

	const originalPhotos = Array.isArray(appeal.photos) ? appeal.photos.map((item) => String(item?.url || "")).filter(Boolean) : [];

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

	const normalizeDeadlineAt = (value) => {
		if (!value) return null;
		const date = new Date(String(value).replace(" ", "T"));
		return Number.isNaN(date.getTime()) ? null : date;
	};

	const nextDescription = typeof body?.description === "string" ? body.description.trim() : appeal.description;
	const nextLocation = normalizeLocation(body?.location) || appeal.location;
	const nextPhotos = normalizeImages(body?.photos?.length ? body.photos : appeal.photos);
	const nextCategory = typeof body?.category === "string" ? body.category.trim() || appeal.category : appeal.category;
	const nextEmployeeId = typeof body?.employeeId === "string" ? body.employeeId.trim() : "";
	const nextPriority = typeof body?.priority === "string" ? body.priority.trim() || appeal.priority : appeal.priority;
	const nextDeadlineAt = normalizeDeadlineAt(body?.deadlineAt) || appeal.deadlineAt;
	const nextModerationNote = typeof body?.moderationNote === "string" ? body.moderationNote.trim() : appeal.moderationNote;
	const nextStatus = appeal.status;
	const changes = [];

	if (nextDescription !== appeal.description) {
		appeal.description = nextDescription;
		changes.push("description");
	}

	if (JSON.stringify(nextLocation) !== JSON.stringify(appeal.location)) {
		appeal.location = nextLocation;
		changes.push("location");
	}

	if (JSON.stringify(nextPhotos) !== JSON.stringify(appeal.photos)) {
		appeal.photos = nextPhotos;
		changes.push("photos");
	}

	if (isAdmin && nextCategory !== appeal.category) {
		appeal.category = nextCategory;
		changes.push("category");
	}

	if (isAdmin && nextEmployeeId) {
		const employee = await UserModel.findById(nextEmployeeId);
		if (!employee || employee.role !== "employee") {
			throw createError({ statusCode: 400, statusMessage: "Сотрудник не найден" });
		}

		if (String(appeal.assignedEmployee || "") !== String(employee._id)) {
			appeal.assignedEmployee = employee._id;
			changes.push("assignedEmployee");
		}
	}

	if (isAdmin && nextPriority !== appeal.priority) {
		appeal.priority = nextPriority;
		changes.push("priority");
	}

	if (isAdmin && nextDeadlineAt && String(nextDeadlineAt) !== String(appeal.deadlineAt)) {
		appeal.deadlineAt = nextDeadlineAt;
		changes.push("deadlineAt");
	}

	if (isAdmin && nextModerationNote !== appeal.moderationNote) {
		appeal.moderationNote = nextModerationNote;
		changes.push("moderationNote");
	}

	if (changes.length && isAdmin) {
		appeal.timeline = [
			...(appeal.timeline || []),
			createAppealTimelineEntry({
				type: "moderator_edit",
				role: user.role,
				authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Администратор",
				title: "Исправлено модератором",
				text: "Обращение отредактировано до повторной проверки AI",
				statusFrom: nextStatus,
				statusTo: nextStatus,
				meta: {
					changes,
				},
			}),
		];
	} else if (changes.length) {
		appeal.timeline = [
			...(appeal.timeline || []),
			createAppealTimelineEntry({
				type: "user_edit",
				role: user.role,
				authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Пользователь",
				title: "Обращение обновлено",
				text: "Пользователь изменил данные обращения перед повторной проверкой",
				statusFrom: nextStatus,
				statusTo: nextStatus,
				meta: { changes },
			}),
		];
	}

	await appeal.save();

	return createSuccessResponse({
		message: "Обращение обновлено",
		data: {
			id: String(appeal._id),
			status: appeal.status,
			assignedEmployee: appeal.assignedEmployee ? String(appeal.assignedEmployee) : null,
			moderationNote: appeal.moderationNote,
			category: appeal.category,
			priority: appeal.priority,
			deadlineAt: appeal.deadlineAt,
			description: appeal.description,
			location: appeal.location,
			photos: appeal.photos,
			updatedAt: appeal.updatedAt,
		},
	});
});
