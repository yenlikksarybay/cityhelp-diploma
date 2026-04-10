import { getCookie, getHeader, createError } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { AppealModel } from "../../models/Appeal.js";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "../../utils/auth/authToken.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";
import { blobService } from "../../services/blobService.js";

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

const getBlobUrls = (appeal) => {
	const urls = [];
	[...(appeal?.photos || []), ...(appeal?.fixedImages || [])].forEach((item) => {
		if (item?.url) {
			urls.push(item.url);
		}
	});
	return [...new Set(urls)];
};

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	const id = event.context.params?.id;
	const appeal = await AppealModel.findById(id);

	if (!appeal) {
		throw createError({ statusCode: 404, statusMessage: "Обращение не найдено" });
	}

	const isOwner = String(appeal.user) === String(user._id);
	const isAdmin = user.role === "admin" || user.role === "superadmin";

	if (!isOwner && !isAdmin) {
		throw createError({ statusCode: 403, statusMessage: "Доступ запрещён" });
	}

	const urls = getBlobUrls(appeal);
	await Promise.all(urls.map((url) => blobService.deleteFile(url).catch(() => null)));
	await AppealModel.deleteOne({ _id: appeal._id });

	return createSuccessResponse({
		message: "Обращение удалено",
		data: {
			id: String(appeal._id),
			deletedImages: urls.length,
		},
	});
});
