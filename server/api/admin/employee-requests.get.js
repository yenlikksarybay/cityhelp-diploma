import { createError, getQuery } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { EmployeeRequestModel, EMPLOYEE_REQUEST_STATUSES } from "../../models/EmployeeRequest.js";
import { getAuthUser } from "../../utils/auth/getAuthUser.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

const ALLOWED_STATUSES = ["all", ...EMPLOYEE_REQUEST_STATUSES];

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const admin = await getAuthUser(event);

	if (admin.role !== "admin" && admin.role !== "superadmin") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const query = getQuery(event);
	const status = String(query.status || "pending").trim().toLowerCase();

	if (!ALLOWED_STATUSES.includes(status)) {
		throw createError({ statusCode: 400, statusMessage: "Некорректный статус заявки" });
	}

	const filter = status === "all" ? {} : { status };
	const requests = await EmployeeRequestModel.find(filter)
		.sort({ createdAt: -1 })
		.populate("user", "firstName lastName email phone role avatar createdAt")
		.populate("reviewedBy", "firstName lastName role")
		.lean();

	const counts = await EmployeeRequestModel.aggregate([
		{
			$group: {
				_id: "$status",
				total: { $sum: 1 },
			},
		},
	]);

	const statusCounts = counts.reduce(
		(acc, item) => ({
			...acc,
			[String(item._id)]: Number(item.total || 0),
		}),
		{},
	);
	const total = Object.values(statusCounts).reduce((sum, value) => sum + Number(value || 0), 0);

	return createSuccessResponse({
		message: "Заявки на сотрудничество получены",
		data: requests.map((request) => ({
			id: String(request._id),
			status: request.status,
			message: request.message || "",
			adminComment: request.adminComment || "",
			createdAt: request.createdAt,
			reviewedAt: request.reviewedAt,
			user: request.user
				? {
						id: String(request.user._id),
						name: `${request.user.firstName || ""} ${request.user.lastName || ""}`.trim(),
						firstName: request.user.firstName || "",
						lastName: request.user.lastName || "",
						email: request.user.email || "",
						phone: request.user.phone || "",
						role: request.user.role || "user",
						avatar: request.user.avatar || null,
						avatarUrl: request.user.avatar?.url || "",
						createdAt: request.user.createdAt,
				  }
				: null,
			reviewedBy: request.reviewedBy
				? {
						id: String(request.reviewedBy._id),
						name: `${request.reviewedBy.firstName || ""} ${request.reviewedBy.lastName || ""}`.trim(),
						role: request.reviewedBy.role || "",
				  }
				: null,
		})),
		meta: {
			total,
			filteredTotal: requests.length,
			status,
			statusCounts,
		},
	});
});
