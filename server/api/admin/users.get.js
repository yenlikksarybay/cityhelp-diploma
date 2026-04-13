import { getQuery, createError, getHeader, getCookie } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { UserModel } from "../../models/User.js";
import { AppealModel } from "../../models/Appeal.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { sanitizeUser } from "../../utils/auth/authResponse.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

const ALLOWED_ROLES = ["user", "employee"];

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);

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

	if (user.role !== "admin" && user.role !== "superadmin") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const query = getQuery(event);
	const role = String(query.role || "user").toLowerCase();
	const search = String(query.search || "").trim();

	if (!ALLOWED_ROLES.includes(role)) {
		throw createError({ statusCode: 400, statusMessage: "Некорректная роль" });
	}

	const filter = { role };

	if (search) {
		filter.$or = [
			{ firstName: { $regex: search, $options: "i" } },
			{ lastName: { $regex: search, $options: "i" } },
			{ phone: { $regex: search, $options: "i" } },
		];
	}

	const users = await UserModel.find(filter).sort({ createdAt: -1 });
	const employeeIds = users.map((user) => user._id);
	const employeeAppealStats = role === "employee" && employeeIds.length
		? await AppealModel.aggregate([
				{ $match: { assignedEmployee: { $in: employeeIds } } },
				{
					$group: {
						_id: "$assignedEmployee",
						user_appeals_count: { $sum: 1 },
						positive_rating_count: {
							$sum: {
								$cond: [
									{ $and: [{ $gte: ["$rating.score", 4] }, { $ne: ["$rating.score", null] }] },
									1,
									0,
								],
							},
						},
						negative_rating_count: {
							$sum: {
								$cond: [
									{ $and: [{ $lte: ["$rating.score", 2] }, { $ne: ["$rating.score", null] }] },
									1,
									0,
								],
							},
						},
						average_rating: {
							$avg: {
								$cond: [
									{ $ne: ["$rating.score", null] },
									"$rating.score",
									null,
								],
							},
						},
					},
				},
			])
		: [];

	const statsMap = new Map(
		employeeAppealStats.map((item) => [
			String(item._id),
			{
				user_appeals_count: item.user_appeals_count || 0,
				positive_rating_count: item.positive_rating_count || 0,
				negative_rating_count: item.negative_rating_count || 0,
				average_rating: item.average_rating || 0,
			},
		]),
	);

	return createSuccessResponse({
		message: "Список пользователей получен",
		data: users.map((user) => {
			const payload = sanitizeUser(user);
			const stats = statsMap.get(String(user._id)) || {
				user_appeals_count: 0,
				positive_rating_count: 0,
				negative_rating_count: 0,
				average_rating: 0,
			};

			return {
				...payload,
				...stats,
			};
		}),
		meta: {
			total: users.length,
			role,
			search,
		},
	});
});
