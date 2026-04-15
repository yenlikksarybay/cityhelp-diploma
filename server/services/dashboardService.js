import { AppealModel } from "../models/Appeal.js";

const ACTIVE_STATUSES = ["new", "processing", "needs_revision"];
const CLOSED_STATUSES = ["completed", "rated"];
const HIDDEN_STATUSES = ["moderation"];

const buildScopeFilter = (user) => {
	return {
		role: String(user?.role || "").toLowerCase() || "admin",
		label: "всех",
		filter: {},
	};
};

const buildDashboardAppeal = (appeal) => ({
	id: String(appeal._id),
	description: appeal.description,
	category: appeal.category,
	priority: appeal.priority,
	status: appeal.status,
	location: appeal.location,
	photos: appeal.photos,
	createdAt: appeal.createdAt,
	deadlineAt: appeal.deadlineAt,
	user: appeal.user
		? {
				id: String(appeal.user._id),
				name: `${appeal.user.firstName || ""} ${appeal.user.lastName || ""}`.trim(),
				email: appeal.user.email,
		  }
		: null,
	assignedEmployee: appeal.assignedEmployee
		? {
				id: String(appeal.assignedEmployee._id),
				name: `${appeal.assignedEmployee.firstName || ""} ${appeal.assignedEmployee.lastName || ""}`.trim(),
		  }
		: null,
	employeeName: appeal.assignedEmployee
		? `${appeal.assignedEmployee.firstName || ""} ${appeal.assignedEmployee.lastName || ""}`.trim()
		: "",
});

export const dashboardService = {
	buildScope(user) {
		return buildScopeFilter(user);
	},

	async getSummary(user) {
		const scope = buildScopeFilter(user);
		const match = {
			...scope.filter,
			status: { $nin: HIDDEN_STATUSES },
		};

		const statusCounts = await AppealModel.aggregate([
			{ $match: match },
			{
				$group: {
					_id: "$status",
					total: { $sum: 1 },
				},
			},
		]);

		const counts = Object.fromEntries(
			statusCounts.map((item) => [item._id || "unknown", item.total]),
		);

		const total = await AppealModel.countDocuments(match);
		const completed = (counts.completed || 0) + (counts.rated || 0);
		const active = ACTIVE_STATUSES.reduce((sum, status) => sum + (counts[status] || 0), 0);
		const rejected = counts.rejected || 0;

		return {
			role: scope.role,
			label: scope.label,
			total,
			completed,
			active,
			rejected,
			statusCounts: counts,
		};
	},

	async getHeatmapPoints(user) {
		const scope = buildScopeFilter(user);
		const appeals = await AppealModel.find({
			...scope.filter,
			status: { $nin: HIDDEN_STATUSES },
			"location.x": { $type: "number" },
			"location.y": { $type: "number" },
		})
			.select("location status priority")
			.lean();

		return appeals.map((appeal) => [appeal.location.x, appeal.location.y]);
	},

	async getPublicLandingHeatmap() {
		const match = {
			status: { $nin: HIDDEN_STATUSES },
		};

		const [appealsWithLocation, statusCounts] = await Promise.all([
			AppealModel.find({
				...match,
				"location.x": { $type: "number" },
				"location.y": { $type: "number" },
			})
				.select("location")
				.lean(),
			AppealModel.aggregate([
				{ $match: match },
				{
					$group: {
						_id: "$status",
						total: { $sum: 1 },
					},
				},
			]),
		]);

		const counts = Object.fromEntries(
			statusCounts.map((item) => [item._id || "unknown", item.total]),
		);

		const totalAppeals = Object.values(counts).reduce(
			(sum, value) => sum + Number(value || 0),
			0,
		);

		return {
			points: appealsWithLocation.map((appeal) => [
				appeal.location.x,
				appeal.location.y,
			]),
			totalAppeals,
			totalPoints: appealsWithLocation.length,
			activeAppeals: ACTIVE_STATUSES.reduce(
				(sum, status) => sum + Number(counts[status] || 0),
				0,
			),
			completedAppeals: Number(counts.completed || 0) + Number(counts.rated || 0),
			rejectedAppeals: Number(counts.rejected || 0),
		};
	},

	async getAppeals(user, limit = 9) {
		const scope = buildScopeFilter(user);
		const appeals = await AppealModel.find({
			...scope.filter,
			status: { $nin: HIDDEN_STATUSES },
		})
			.sort({ createdAt: -1 })
			.limit(Number(limit) || 9)
			.populate("user", "firstName lastName email phone role")
			.populate("assignedEmployee", "firstName lastName email phone role")
			.lean();

		return appeals.map(buildDashboardAppeal);
	},
};
