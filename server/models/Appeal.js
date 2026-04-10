import mongoose from "mongoose";

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
		score: { type: Number, default: null },
		comment: { type: String, default: "" },
		createdAt: { type: Date, default: null },
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
		priority: {
			type: String,
			default: "medium",
			index: true,
		},
		status: {
			type: String,
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
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const AppealModel = mongoose.models.Appeal || mongoose.model("Appeal", appealSchema);
