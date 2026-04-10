import { getCookie, getHeader, getQuery, createError } from "h3";
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
	const query = getQuery(event);
	const role = String(query.role || user.role || "user").toLowerCase();
	const status = String(query.status || "").trim();
	const priority = String(query.priority || "").trim();
	const search = String(query.search || "").trim();

	const filter = {};
	if (role === "user") {
		filter.user = user._id;
	} else if (role === "employee") {
		filter.assignedEmployee = user._id;
	}

	if (status) {
		filter.status = status;
	}

	if (priority) {
		filter.priority = priority;
	}

	if (search) {
		filter.$or = [
			{ description: { $regex: search, $options: "i" } },
			{ category: { $regex: search, $options: "i" } },
		];
	}

	const appeals = await AppealModel.find(filter)
		.sort({ createdAt: -1 })
		.populate("user", "firstName lastName email phone role")
		.populate("assignedEmployee", "firstName lastName email phone role")
		.lean();

	const statusCounts = await AppealModel.aggregate([
		{ $match: filter },
		{
			$group: {
				_id: "$status",
				total: { $sum: 1 },
			},
		},
	]);

	const countsMap = Object.fromEntries(
		statusCounts.map((item) => [item._id || "unknown", item.total]),
	);

	return createSuccessResponse({
		message: "Обращения получены",
		data: appeals.map((appeal) => ({
			id: String(appeal._id),
			user: appeal.user
				? {
						id: String(appeal.user._id),
						firstName: appeal.user.firstName,
						lastName: appeal.user.lastName,
						name: `${appeal.user.firstName || ""} ${appeal.user.lastName || ""}`.trim(),
						email: appeal.user.email,
						phone: appeal.user.phone,
						role: appeal.user.role,
				  }
				: null,
			description: appeal.description,
			photos: appeal.photos,
			location: appeal.location,
			category: appeal.category,
			priority: appeal.priority,
			status: appeal.status,
			assignedEmployee: appeal.assignedEmployee
				? {
						id: String(appeal.assignedEmployee._id),
						name: `${appeal.assignedEmployee.firstName || ""} ${appeal.assignedEmployee.lastName || ""}`.trim(),
						role: appeal.assignedEmployee.role,
				  }
				: null,
			employeeName: appeal.assignedEmployee
				? `${appeal.assignedEmployee.firstName || ""} ${appeal.assignedEmployee.lastName || ""}`.trim()
				: "",
			deadlineAt: appeal.deadlineAt,
			rating: appeal.rating,
			aiResult: appeal.aiResult,
			createdAt: appeal.createdAt,
		})),
		meta: {
			total: appeals.length,
			role,
			status,
			priority,
			search,
			statusCounts: countsMap,
		},
	});
});
