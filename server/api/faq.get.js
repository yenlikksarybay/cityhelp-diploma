import connectToDatabase from "../config/mongoDB.js";
import { createSuccessResponse } from "../utils/createSuccessResponse.js";
import { ensureDefaultFaqs } from "../utils/knowledgeBase.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const faqs = await ensureDefaultFaqs();

	return createSuccessResponse({
		message: "FAQ получен",
		data: faqs.filter((item) => item.isActive),
	});
});
