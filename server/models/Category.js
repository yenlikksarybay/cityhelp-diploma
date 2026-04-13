import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
		key: { type: String, required: true, unique: true, trim: true, index: true },
		name: { type: String, required: true, trim: true },
		description: { type: String, default: "", trim: true },
		subcategories: { type: [String], default: [] },
		order: { type: Number, default: 0, index: true },
		isActive: { type: Boolean, default: true, index: true },
	},
	{ timestamps: true, versionKey: false },
);

export const CategoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);
