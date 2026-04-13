import { readFormData, createError } from "h3";
import connectToDatabase from "../../config/mongoDB.js";
import { getAuthUser } from "../../utils/auth/getAuthUser.js";
import { sanitizeUser } from "../../utils/auth/authResponse.js";
import { blobService } from "../../services/blobService.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	const formData = await readFormData(event);
	const file = formData.get("file");

	if (!file) {
		throw createError({ statusCode: 400, statusMessage: "Файл не выбран" });
	}

	const previousAvatar = user.avatar || null;

	const uploadedFile = await blobService.uploadImage(file, {
		folder: `cityhelp/users/${user._id}/avatar`,
	});

	user.avatar = {
		url: uploadedFile.url,
		pathname: uploadedFile.pathname || "",
		name: uploadedFile.pathname?.split("/").pop() || file.name || "",
		type: file.type || "",
		size: Number(file.size || 0),
		uploadedAt: new Date(),
	};

	await user.save();

	if (previousAvatar?.url) {
		try {
			await blobService.deleteFile(previousAvatar.url);
		} catch (error) {
			console.error("Не удалось удалить старый аватар", error);
		}
	}

	return createSuccessResponse({
		message: "Аватар обновлён",
		data: sanitizeUser(user),
	});
});
