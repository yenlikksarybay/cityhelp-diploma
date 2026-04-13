import connectToDatabase from "../../config/mongoDB.js";
import { getAuthUser } from "../../utils/auth/getAuthUser.js";
import { sanitizeUser } from "../../utils/auth/authResponse.js";
import { blobService } from "../../services/blobService.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);

	if (user.avatar?.url) {
		await blobService.deleteFile(user.avatar.url);
		user.avatar = null;
		await user.save();
	}

	return createSuccessResponse({
		message: "Аватар удалён",
		data: sanitizeUser(user),
	});
});
