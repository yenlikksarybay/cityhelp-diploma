import { getCookie, getHeader, getQuery, createError } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";
import { dashboardService } from "../../services/dashboardService.js";

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
	const query = getQuery(event);
	const limit = Number(query.limit || 9);
	const appeals = await dashboardService.getAppeals(user, limit);

	return createSuccessResponse({
		message: "Обращения дашборда получены",
		data: appeals,
		meta: {
			total: appeals.length,
			limit,
		},
	});
});
