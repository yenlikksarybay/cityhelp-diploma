import { del, list, put } from "@vercel/blob";
import { createErrorResponse } from "../utils/createErrorResponse.js";
import { buildBlobPath } from "../utils/blobPath.js";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

const getBlobFolder = () => {
	return process.env.BLOB_UPLOAD_FOLDER || "cityhelp";
};

export const blobService = {
	async uploadImage(file) {
		if (!file) {
			createErrorResponse(400, "Файл не передан");
		}

		if (!file.type?.startsWith("image/")) {
			createErrorResponse(400, "Можно загружать только изображения");
		}

		if (file.size > MAX_FILE_SIZE) {
			createErrorResponse(
				400,
				"Файл слишком большой. Для server upload используйте файлы до 4.5 MB"
			);
		}

		const pathname = buildBlobPath(file.name, getBlobFolder());
		const arrayBuffer = await file.arrayBuffer();

		return await put(pathname, arrayBuffer, {
			access: "public",
			contentType: file.type,
			addRandomSuffix: false,
		});
	},

	async getFiles() {
		return await list({
			prefix: `${getBlobFolder()}/`,
			mode: "expanded",
		});
	},

	async deleteFile(url) {
		if (!url) {
			createErrorResponse(400, "Нужен параметр url");
		}

		await del(url);

		return {
			url,
		};
	},
};
