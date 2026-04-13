import { getCookie, getHeader, createError, readBody } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { FaqModel } from "../../models/Faq.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

const getAuthUser = async (event) => {
	const header = getHeader(event, "authorization");
	const token = header?.startsWith("Bearer ") ? header.slice(7) : getCookie(event, "token");
	const payload = verifyAuthToken(token);
	if (!payload?.sub) {
		throw createError({ statusCode: 401, statusMessage: "Не авторизован" });
	}
	const user = await UserModel.findById(payload.sub);
	if (!user) {
		throw createError({ statusCode: 401, statusMessage: "Не авторизован" });
	}
	return user;
};

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	if (user.role !== "admin" && user.role !== "superadmin") {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const body = await readBody(event);
	const question = String(body?.question || "").trim();
	const answer = String(body?.answer || "").trim();
	if (!question || !answer) {
		throw createError({ statusCode: 400, statusMessage: "Заполните вопрос и ответ" });
	}

	const faq = await FaqModel.create({
		key: String(body?.key || question.toLowerCase().replace(/\s+/g, "-")).trim(),
		question,
		answer,
		category: String(body?.category || "Общие вопросы").trim(),
		order: Number(body?.order || 0),
		isActive: Boolean(body?.isActive ?? true),
	});

	return createSuccessResponse({
		message: "FAQ создан",
		data: {
			id: String(faq._id),
			key: faq.key,
			question: faq.question,
			answer: faq.answer,
			category: faq.category,
			order: faq.order,
			isActive: faq.isActive,
		},
	});
});
