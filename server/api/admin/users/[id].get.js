import { getCookie, getHeader, getQuery, createError } from "h3";
import connectToDatabase from "../../../config/mongoDB.js";
import { UserModel } from "../../../models/User.js";
import { AppealModel } from "../../../models/Appeal.js";
import { verifyAuthToken } from "../../../utils/auth/authToken.js";
import { sanitizeUser } from "../../../utils/auth/authResponse.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";
import { getAppealClosedAt, getAppealRoadmap, normalizeAppealTimeline } from "../../../utils/appealTimeline.js";

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
	const query = getQuery(event);
	const page = Math.max(1, Number(query.page || 1));
	const limit = Math.min(20, Math.max(1, Number(query.limit || 10)));
	const statusGroup = String(query.statusGroup || "").trim();

	const targetUser = await UserModel.findOne({ _id: id, role: "user" }).lean();
	if (!targetUser) {
		throw createError({ statusCode: 404, statusMessage: "Пользователь не найден" });
	}

	const filter = { user: targetUser._id };
	if (statusGroup) {
		const statusGroupMap = {
			new: ["new"],
			moderation: ["moderation"],
			processing: ["processing"],
			needs_revision: ["needs_revision"],
			completed: ["completed"],
			rated: ["rated"],
			rejected: ["rejected"],
			all: ["new", "moderation", "processing", "needs_revision", "completed", "rated", "rejected"],
		};
		const allowedStatuses = statusGroupMap[statusGroup];
		if (allowedStatuses) {
			filter.status = { $in: allowedStatuses };
		}
	}

	const total = await AppealModel.countDocuments(filter);
	const appeals = await AppealModel.find(filter)
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit)
		.populate("assignedEmployee", "firstName lastName email phone role")
		.lean();

	const stats = await AppealModel.aggregate([
		{ $match: { user: targetUser._id } },
		{
			$group: {
				_id: null,
				totalAppeals: { $sum: 1 },
				openAppeals: {
					$sum: {
						$cond: [
							{ $in: ["$status", ["new", "moderation", "processing", "needs_revision"]] },
							1,
							0,
						],
					},
				},
				closedAppeals: {
					$sum: {
						$cond: [
							{ $in: ["$status", ["completed", "rated", "rejected"]] },
							1,
							0,
						],
					},
				},
				positiveRatingCount: {
					$sum: {
						$cond: [
							{ $and: [{ $ne: ["$rating.score", null] }, { $gte: ["$rating.score", 4] }] },
							1,
							0,
						],
					},
				},
				negativeRatingCount: {
					$sum: {
						$cond: [
							{ $and: [{ $ne: ["$rating.score", null] }, { $lte: ["$rating.score", 2] }] },
							1,
							0,
						],
					},
				},
				averageRating: {
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
	]);

	const stat = stats?.[0] || {};
	const userPayload = sanitizeUser(targetUser);

	return createSuccessResponse({
		message: "Пользователь получен",
		data: {
			user: {
				...userPayload,
			},
			stats: {
				totalAppeals: stat.totalAppeals || 0,
				openAppeals: stat.openAppeals || 0,
				closedAppeals: stat.closedAppeals || 0,
				positiveRatingCount: stat.positiveRatingCount || 0,
				negativeRatingCount: stat.negativeRatingCount || 0,
				averageRating: Number(stat.averageRating || 0),
			},
			appeals: appeals.map((appeal) => ({
				id: String(appeal._id),
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
					  }
					: null,
				deadlineAt: appeal.deadlineAt,
				rating: appeal.rating,
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
			},
		},
	});
});
