import { getQuery, readFormData } from "h3";
import { blobService } from "../services/blobService.js";
import { createSuccessResponse } from "../utils/createSuccessResponse.js";

export const uploadBlobFile = async (event) => {
	const formData = await readFormData(event);
	const file = formData.get("file");
	const folder = String(formData.get("folder") || "").trim();
	const uploadedFile = await blobService.uploadImage(file, { folder });

	return createSuccessResponse({
		message: "Файл загружен в Vercel Blob",
		data: uploadedFile,
	});
};

export const getBlobFiles = async () => {
	const files = await blobService.getFiles();

	return createSuccessResponse({
		message: "Список файлов получен",
		data: files.blobs,
		meta: {
			hasMore: files.hasMore,
			cursor: files.cursor || null,
		},
	});
};

export const deleteBlobFile = async (event) => {
	const query = getQuery(event);
	const deletedFile = await blobService.deleteFile(query.url);

	return createSuccessResponse({
		message: "Файл удалён из Vercel Blob",
		data: deletedFile,
	});
};
