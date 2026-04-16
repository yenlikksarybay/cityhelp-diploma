import { getQuery } from "h3";
import connectToDatabase from "../config/mongoDB.js";
import { AppealModel } from "../models/Appeal.js";
import { createSuccessResponse } from "../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);

	const query = getQuery(event);
	const employeeId = query.employeeId;

	let stats;

	if (employeeId) {
		// Статистика конкретного сотрудника
		stats = await AppealModel.getEmployeeRatingStats(employeeId);
		stats.employeeId = employeeId;
	} else {
		// Общая статистика
		stats = await AppealModel.getOverallRatingStats();
	}

	return createSuccessResponse({
		message: employeeId ? "Статистика рейтинга сотрудника получена" : "Общая статистика рейтинга получена",
		data: stats,
	});
});