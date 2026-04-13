import { getCookie, getHeader, createError, readBody } from "h3";
import connectToDatabase from "../../../config/mongoDB.js";
import { FaqModel } from "../../../models/Faq.js";
import { UserModel } from "../../../models/User.js";
import { verifyAuthToken } from "../../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

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

	const id = event.context.params?.id;
	const body = await readBody(event);
	const faq = await FaqModel.findById(id);
	if (!faq) {
		throw createError({ statusCode: 404, statusMessage: "FAQ не найден" });
	}

	faq.question = String(body?.question ?? faq.question).trim();
	faq.answer = String(body?.answer ?? faq.answer).trim();
	faq.category = String(body?.category ?? faq.category).trim();
	faq.order = Number(body?.order ?? faq.order);
	faq.isActive = Boolean(body?.isActive ?? faq.isActive);
	if (body?.key) {
		faq.key = String(body.key).trim();
	}
	await faq.save();

	return createSuccessResponse({
		message: "FAQ обновлён",
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
