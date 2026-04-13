import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
	{
		key: { type: String, required: true, unique: true, trim: true, index: true },
		question: { type: String, required: true, trim: true },
		answer: { type: String, required: true, trim: true },
		category: { type: String, default: "Общие вопросы", trim: true, index: true },
		order: { type: Number, default: 0, index: true },
		isActive: { type: Boolean, default: true, index: true },
	},
	{ timestamps: true, versionKey: false },
);

export const FaqModel = mongoose.models.Faq || mongoose.model("Faq", faqSchema);
