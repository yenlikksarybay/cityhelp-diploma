import mongoose from "mongoose";

const promptSchema = new mongoose.Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		module: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		moduleLabel: {
			type: String,
			required: true,
			trim: true,
		},
		tone: {
			type: String,
			required: true,
			trim: true,
		},
		toneLabel: {
			type: String,
			required: true,
			trim: true,
		},
		systemPrompt: {
			type: String,
			default: "",
		},
		userTemplate: {
			type: String,
			default: "",
		},
		guardrails: {
			type: String,
			default: "",
		},
		exampleInput: {
			type: String,
			default: "",
		},
			exampleOutput: {
				type: String,
				default: "",
			},
			version: {
				type: Number,
				default: 1,
				index: true,
			},
			isActive: {
				type: Boolean,
				default: true,
			},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const PromptModel = mongoose.models.Prompt || mongoose.model("Prompt", promptSchema);
