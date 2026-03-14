import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			default: "",
			trim: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const TestModel =
	mongoose.models.Test || mongoose.model("Test", testSchema);
