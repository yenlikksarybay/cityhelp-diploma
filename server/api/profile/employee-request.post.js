import { createError, readBody } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { EmployeeRequestModel } from "../../models/EmployeeRequest.js";
import { getAuthUser } from "../../utils/auth/getAuthUser.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	const body = await readBody(event);

	if (user.role !== "user") {
		throw createError({
			statusCode: 400,
			statusMessage: "Заявку на роль сотрудника может отправить только пользователь",
		});
	}

	const latestRequest = await EmployeeRequestModel.findOne({ user: user._id }).sort({ createdAt: -1 });
	if (latestRequest?.status === "pending") {
		throw createError({
			statusCode: 409,
			statusMessage: "У вас уже есть активная заявка на рассмотрении",
		});
	}

	const request = await EmployeeRequestModel.create({
		user: user._id,
		status: "pending",
		message: String(body?.message || "").trim(),
	});

	return createSuccessResponse({
		message: "Заявка на сотрудничество отправлена",
		data: {
			id: String(request._id),
			status: request.status,
			message: request.message || "",
			adminComment: request.adminComment || "",
			createdAt: request.createdAt,
			reviewedAt: request.reviewedAt,
		},
	});
});
