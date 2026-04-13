import { DEFAULT_CATEGORIES, DEFAULT_FAQ_ITEMS } from "../constants/knowledgeBase.js";
import { FaqModel } from "../models/Faq.js";
import { CategoryModel } from "../models/Category.js";

export const ensureDefaultFaqs = async () => {
	const total = await FaqModel.countDocuments({});
	if (total === 0) {
		await FaqModel.insertMany(DEFAULT_FAQ_ITEMS);
	}
	return FaqModel.find({}).sort({ order: 1, createdAt: 1 }).lean();
};

export const ensureDefaultCategories = async () => {
	const total = await CategoryModel.countDocuments({});
	if (total === 0) {
		await CategoryModel.insertMany(DEFAULT_CATEGORIES);
	}
	return CategoryModel.find({}).sort({ order: 1, createdAt: 1 }).lean();
};
