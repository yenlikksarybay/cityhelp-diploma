import { readBody, getCookie, getHeader, createError } from "h3";
import connectToDatabase from "../../../config/mongoDB.js";
import { AppealModel } from "../../../models/Appeal.js";
import { UserModel } from "../../../models/User.js";
import { verifyAuthToken } from "../../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

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
	const employeeId = String(body?.employeeId || "").trim();

	if (!employeeId) {
		throw createError({ statusCode: 400, statusMessage: "Выберите сотрудника" });
	}

	const appeal = await AppealModel.findById(id).populate(
		"assignedEmployee",
		"firstName lastName email phone role",
	);

	if (!appeal) {
		throw createError({ statusCode: 404, statusMessage: "Обращение не найдено" });
	}

	const employee = await UserModel.findById(employeeId);
	if (!employee || employee.role !== "employee") {
		throw createError({ statusCode: 400, statusMessage: "Сотрудник не найден" });
	}

	appeal.assignedEmployee = employee._id;
	await appeal.save();

	return createSuccessResponse({
		message: "Сотрудник назначен",
		data: {
			id: String(appeal._id),
			assignedEmployee: {
				id: String(employee._id),
				name: `${employee.firstName || ""} ${employee.lastName || ""}`.trim(),
				role: employee.role,
			},
			updatedAt: appeal.updatedAt,
		},
	});
});
