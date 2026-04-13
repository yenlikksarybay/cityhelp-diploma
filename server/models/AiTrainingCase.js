import mongoose from "mongoose";

const aiDiffSchema = new mongoose.Schema(
	{
		categoryChanged: { type: Boolean, default: false },
		subCategoryChanged: { type: Boolean, default: false },
		priorityChanged: { type: Boolean, default: false },
		statusChanged: { type: Boolean, default: false },
		employeeChanged: { type: Boolean, default: false },
		deadlineChanged: { type: Boolean, default: false },
		descriptionChanged: { type: Boolean, default: false },
		locationChanged: { type: Boolean, default: false },
		photosChanged: { type: Boolean, default: false },
		summaryEdited: { type: Boolean, default: false },
	},
	{ _id: false },
);

const decisionSnapshotSchema = new mongoose.Schema(
	{
		description: { type: String, default: "" },
		category: { type: String, default: "" },
		subCategory: { type: String, default: "" },
		priority: { type: String, default: "" },
		status: { type: String, default: "" },
		assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
		deadlineAt: { type: Date, default: null },
		moderationNote: { type: String, default: "" },
	},
	{ _id: false },
);

const aiTrainingCaseSchema = new mongoose.Schema(
	{
		appeal: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Appeal",
			required: true,
			index: true,
		},
		moderator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
			index: true,
		},
		source: {
			type: String,
			enum: ["moderator_edit", "admin_moderation"],
			required: true,
			index: true,
		},
		action: {
			type: String,
			enum: ["edit", "approved", "rejected"],
			required: true,
			index: true,
		},
		description: { type: String, default: "" },
		location: { type: mongoose.Schema.Types.Mixed, default: null },
		photos: { type: [mongoose.Schema.Types.Mixed], default: [] },
		aiOutput: { type: mongoose.Schema.Types.Mixed, default: null },
		originalDecision: { type: decisionSnapshotSchema, default: () => ({}) },
		finalDecision: { type: decisionSnapshotSchema, default: () => ({}) },
		correctedFields: { type: [String], default: [] },
		aiDiff: { type: aiDiffSchema, default: () => ({}) },
		moderatorNote: { type: String, default: "" },
		promptVersion: { type: Number, default: null, index: true },
		analysisPipelineVersion: { type: String, default: "", index: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const AiTrainingCaseModel =
	mongoose.models.AiTrainingCase || mongoose.model("AiTrainingCase", aiTrainingCaseSchema);
