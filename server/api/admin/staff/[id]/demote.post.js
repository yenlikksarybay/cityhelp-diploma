import { createError } from "h3";
import connectToDatabase from "../../../../config/mongoDB.js";
import { AppealModel } from "../../../../models/Appeal.js";
import { UserModel } from "../../../../models/User.js";
import { getAuthUser } from "../../../../utils/auth/getAuthUser.js";
import { createSuccessResponse } from "../../../../utils/createSuccessResponse.js";

const ACTIVE_STATUSES = ["new", "moderation", "processing", "needs_revision"];

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const admin = await getAuthUser(event);

	if (admin.role !== "admin" && admin.role !== "superadmin") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const employee = await UserModel.findOne({ _id: event.context.params?.id, role: "employee" });
	if (!employee) {
		throw createError({ statusCode: 404, statusMessage: "Сотрудник не найден" });
	}

	const activeAppealsCount = await AppealModel.countDocuments({
		assignedEmployee: employee._id,
		status: { $in: ACTIVE_STATUSES },
	});

	if (activeAppealsCount > 0) {
		throw createError({
			statusCode: 400,
			statusMessage: "Нельзя понизить сотрудника, пока на нём есть активные обращения",
		});
	}

	employee.role = "user";
	await employee.save();

	return createSuccessResponse({
		message: "Сотрудник переведён в пользователя",
		data: {
			id: String(employee._id),
			role: employee.role,
		},
	});
});
