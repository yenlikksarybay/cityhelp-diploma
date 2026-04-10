import { getCookie, getHeader, createError } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { AppealModel } from "../../models/Appeal.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

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
	const appeal = await AppealModel.findById(id)
		.populate("user", "firstName lastName email phone role")
		.populate("assignedEmployee", "firstName lastName email phone role")
		.lean();

	if (!appeal) {
		throw createError({ statusCode: 404, statusMessage: "Обращение не найдено" });
	}

	return createSuccessResponse({
		message: "Обращение получено",
		data: {
			id: String(appeal._id),
			user: appeal.user,
			description: appeal.description,
			photos: appeal.photos,
			location: appeal.location,
			category: appeal.category,
			priority: appeal.priority,
			status: appeal.status,
			assignedEmployee: appeal.assignedEmployee,
			employeeName: appeal.assignedEmployee
				? `${appeal.assignedEmployee.firstName || ""} ${appeal.assignedEmployee.lastName || ""}`.trim()
				: "",
			deadlineAt: appeal.deadlineAt,
			moderationNote: appeal.moderationNote,
			employeeNote: appeal.employeeNote,
			fixedLocation: appeal.fixedLocation,
			fixedImages: appeal.fixedImages,
			rating: appeal.rating,
			aiResult: appeal.aiResult,
			createdAt: appeal.createdAt,
			updatedAt: appeal.updatedAt,
		},
	});
});
