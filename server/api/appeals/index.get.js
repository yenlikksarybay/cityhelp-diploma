import { getCookie, getHeader, getQuery, createError } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { AppealModel } from "../../models/Appeal.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";
import { getAppealClosedAt, getAppealRoadmap, normalizeAppealTimeline } from "../../utils/appealTimeline.js";

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
	const statusGroup = String(query.statusGroup || "").trim();
	const priority = String(query.priority || "").trim();
	const search = String(query.search || "").trim();
	const page = Math.max(1, Number(query.page || 1));
	const limit = Math.min(50, Math.max(1, Number(query.limit || 12)));
	const employeeVisibleStatuses = ["new", "processing", "needs_revision", "completed", "rated", "rejected"];

	const filter = {};
	if (role === "user") {
		filter.user = user._id;
	} else if (role === "employee") {
		filter.assignedEmployee = user._id;
		filter.status = { $in: employeeVisibleStatuses };
	}

	if (status) {
		if (role === "employee") {
			filter.status = employeeVisibleStatuses.includes(status) ? status : "__hidden__";
		} else {
			filter.status = status;
		}
	} else if (statusGroup) {
		const statusGroupMap = {
			new: ["new"],
			moderation: ["moderation"],
			processing: ["processing"],
			needs_revision: ["needs_revision"],
			completed: ["completed", "rated"],
			rated: ["rated"],
			rejected: ["rejected"],
		};
		const allowedStatuses = statusGroupMap[statusGroup];
		if (allowedStatuses) {
			filter.status = { $in: allowedStatuses };
		}
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
		.skip((page - 1) * limit)
		.limit(limit)
		.populate("user", "firstName lastName email phone role")
		.populate("assignedEmployee", "firstName lastName email phone role")
		.lean();

	const total = await AppealModel.countDocuments(filter);

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
			subCategory: appeal.subCategory || "",
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
			closedAt: getAppealClosedAt(appeal.timeline),
			roadmap: getAppealRoadmap(appeal.timeline),
			timeline: normalizeAppealTimeline(appeal.timeline),
			createdAt: appeal.createdAt,
		})),
		meta: {
			total,
			page,
			limit,
			totalPages: Math.max(1, Math.ceil(total / limit)),
			role,
			status,
			statusGroup,
			priority,
			search,
			statusCounts: countsMap,
		},
	});
});
