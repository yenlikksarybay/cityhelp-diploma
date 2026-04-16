import mongoose from "mongoose";
import { APPEAL_PRIORITIES, APPEAL_STATUSES } from "../constants/appeal.js";

const imageSchema = new mongoose.Schema(
	{
		url: { type: String, required: true },
		pathname: { type: String, default: "" },
		name: { type: String, default: "" },
		type: { type: String, default: "" },
		size: { type: Number, default: 0 },
	},
	{ _id: false },
);

const locationSchema = new mongoose.Schema(
	{
		x: { type: Number, required: true },
		y: { type: Number, required: true },
		address: { type: String, default: "" },
		label: { type: String, default: "" },
	},
	{ _id: false },
);

const ratingSchema = new mongoose.Schema(
	{
		type: { type: String, enum: ["like", "dislike"], default: null },
		role: { type: String, default: null },
		createdAt: { type: Date, default: null },
	},
	{ _id: false },
);

const timelineSchema = new mongoose.Schema(
	{
		type: { type: String, default: "system" },
		role: { type: String, default: "system" },
		authorName: { type: String, default: "" },
		title: { type: String, default: "" },
		text: { type: String, default: "" },
		statusFrom: { type: String, default: null },
		statusTo: { type: String, default: null },
		meta: { type: mongoose.Schema.Types.Mixed, default: {} },
		createdAt: { type: Date, default: Date.now },
	},
	{ _id: false },
);

const appealSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		photos: {
			type: [imageSchema],
			default: [],
			validate: {
				validator(value) {
					return Array.isArray(value) && value.length <= 5;
				},
				message: "Можно прикрепить не более 5 изображений",
			},
		},
		location: {
			type: locationSchema,
			required: true,
		},
		category: {
			type: String,
			default: "unclassified",
			index: true,
		},
		subCategory: {
			type: String,
			default: "",
			index: true,
		},
		priority: {
			type: String,
			enum: Object.keys(APPEAL_PRIORITIES),
			default: "medium",
			index: true,
		},
		status: {
			type: String,
			enum: Object.keys(APPEAL_STATUSES),
			default: "new",
			index: true,
		},
		assignedEmployee: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
			index: true,
		},
		deadlineAt: {
			type: Date,
			default: null,
			index: true,
		},
		moderationNote: {
			type: String,
			default: "",
		},
		employeeNote: {
			type: String,
			default: "",
		},
		fixedLocation: {
			type: locationSchema,
			default: null,
		},
		fixedImages: {
			type: [imageSchema],
			default: [],
		},
		aiResult: {
			type: mongoose.Schema.Types.Mixed,
			default: null,
		},
		rating: {
			type: ratingSchema,
			default: () => ({}),
		},
		timeline: {
			type: [timelineSchema],
			default: [],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const AppealModel = mongoose.models.Appeal || mongoose.model("Appeal", appealSchema);

// Статические методы для работы с рейтингом
AppealModel.getOverallRatingStats = async function () {
	const result = await this.aggregate([
		{
			$match: {
				"rating.type": { $ne: null },
			},
		},
		{
			$group: {
				_id: null,
				totalRatings: { $sum: 1 },
				likes: {
					$sum: {
						$cond: [{ $eq: ["$rating.type", "like"] }, 1, 0],
					},
				},
				dislikes: {
					$sum: {
						$cond: [{ $eq: ["$rating.type", "dislike"] }, 1, 0],
					},
				},
			},
		},
		{
			$project: {
				totalRatings: 1,
				likes: 1,
				dislikes: 1,
				positivePercentage: {
					$multiply: [
						{ $divide: ["$likes", "$totalRatings"] },
						100,
					],
				},
			},
		},
	]);

	return result[0] || { totalRatings: 0, likes: 0, dislikes: 0, positivePercentage: 0 };
};

AppealModel.getEmployeeRatingStats = async function (employeeId) {
	const result = await this.aggregate([
		{
			$match: {
				assignedEmployee: employeeId,
				"rating.type": { $ne: null },
			},
		},
		{
			$group: {
				_id: null,
				totalRatings: { $sum: 1 },
				likes: {
					$sum: {
						$cond: [{ $eq: ["$rating.type", "like"] }, 1, 0],
					},
				},
				dislikes: {
					$sum: {
						$cond: [{ $eq: ["$rating.type", "dislike"] }, 1, 0],
					},
				},
			},
		},
		{
			$project: {
				totalRatings: 1,
				likes: 1,
				dislikes: 1,
				positivePercentage: {
					$cond: [
						{ $gt: ["$totalRatings", 0] },
						{ $multiply: [{ $divide: ["$likes", "$totalRatings"] }, 100] },
						0,
					],
				},
				ratingScore: {
					$cond: [
						{ $gt: ["$totalRatings", 0] },
						{ $subtract: ["$likes", "$dislikes"] },
						0,
					],
				},
			},
		},
	]);

	return result[0] || { totalRatings: 0, likes: 0, dislikes: 0, positivePercentage: 0, ratingScore: 0 };
};
