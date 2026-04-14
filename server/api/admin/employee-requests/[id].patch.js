import { createError, readBody } from "h3";
import connectToDatabase from "../../../config/mongoDB.js";
import { EmployeeRequestModel } from "../../../models/EmployeeRequest.js";
import { UserModel } from "../../../models/User.js";
import { getAuthUser } from "../../../utils/auth/getAuthUser.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

const ALLOWED_ACTIONS = ["approved", "rejected"];

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const admin = await getAuthUser(event);

	if (admin.role !== "admin" && admin.role !== "superadmin") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const body = await readBody(event);
	const status = String(body?.status || "").trim().toLowerCase();
	if (!ALLOWED_ACTIONS.includes(status)) {
		throw createError({ statusCode: 400, statusMessage: "Некорректное решение по заявке" });
	}

	const request = await EmployeeRequestModel.findById(event.context.params?.id);
	if (!request) {
		throw createError({ statusCode: 404, statusMessage: "Заявка не найдена" });
	}

	if (request.status !== "pending") {
		throw createError({ statusCode: 400, statusMessage: "Заявка уже обработана" });
	}

	const user = await UserModel.findById(request.user);
	if (!user) {
		throw createError({ statusCode: 404, statusMessage: "Пользователь не найден" });
	}

	request.status = status;
	request.adminComment = String(body?.adminComment || "").trim();
	request.reviewedBy = admin._id;
	request.reviewedAt = new Date();

	if (status === "approved") {
		user.role = "employee";
		await user.save();
	}

	await request.save();

	return createSuccessResponse({
		message: status === "approved" ? "Заявка одобрена" : "Заявка отклонена",
		data: {
			id: String(request._id),
			status: request.status,
			adminComment: request.adminComment || "",
			reviewedAt: request.reviewedAt,
			user: {
				id: String(user._id),
				role: user.role,
			},
		},
	});
});
