import { DEFAULT_CATEGORIES, DEFAULT_FAQ_ITEMS } from "../constants/knowledgeBase.js";
import { FaqModel } from "../models/Faq.js";
import { CategoryModel } from "../models/Category.js";

export const ensureDefaultFaqs = async () => {
	await Promise.all(
		DEFAULT_FAQ_ITEMS.map((item) =>
			FaqModel.updateOne({ key: item.key }, { $setOnInsert: item }, { upsert: true }),
		),
	);
	return FaqModel.find({}).sort({ order: 1, createdAt: 1 }).lean();
};

export const ensureDefaultCategories = async () => {
	const total = await CategoryModel.countDocuments({});
	if (total === 0) {
		await CategoryModel.insertMany(DEFAULT_CATEGORIES);
	}
	return CategoryModel.find({}).sort({ order: 1, createdAt: 1 }).lean();
};
