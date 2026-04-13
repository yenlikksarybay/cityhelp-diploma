import { createError, getCookie, getHeader } from "h3";
import { UserModel } from "../../models/User.js";
import { verifyAuthToken } from "./authToken.js";

export const getAuthUser = async (event, options = {}) => {
	const header = getHeader(event, "authorization");
	const token = header?.startsWith("Bearer ") ? header.slice(7) : getCookie(event, "token");
	const payload = verifyAuthToken(token);

	if (!payload?.sub) {
		throw createError({ statusCode: 401, statusMessage: "Не авторизован" });
	}

	let query = UserModel.findById(payload.sub);
	if (options.select) {
		query = query.select(options.select);
	}

	const user = await query;
	if (!user) {
		throw createError({ statusCode: 401, statusMessage: "Не авторизован" });
	}

	return user;
};
