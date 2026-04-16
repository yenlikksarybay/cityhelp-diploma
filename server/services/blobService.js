import { del, list, put } from "@vercel/blob";
import { createErrorResponse } from "../utils/createErrorResponse.js";
import { buildBlobPath } from "../utils/blobPath.js";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

const getBlobRootFolder = () => {
	return process.env.BLOB_APPEALS_ROOT_FOLDER || process.env.BLOB_UPLOAD_FOLDER || "cityhelp/appeals";
};

const normalizeFolder = (folder = "") => {
	return String(folder || "")
		.trim()
		.replace(/^\/+|\/+$/g, "")
		.replace(/\/+/g, "/");
};

const resolveUploadFolder = (folder) => {
	const normalized = normalizeFolder(folder);
	return normalized || normalizeFolder(getBlobRootFolder());
};

export const blobService = {
	async uploadImage(file, options = {}) {
		if (!file) {
			return createErrorResponse(400, "Файл не передан");
		}

		if (!file.type?.startsWith("image/")) {
			return createErrorResponse(400, "Можно загружать только изображения");
		}

		if (file.size > MAX_FILE_SIZE) {
			return createErrorResponse(
				400,
				"Файл слишком большой. Для server upload используйте файлы до 4.5 MB"
			);
		}

		const folder = resolveUploadFolder(options.folder);
		const pathname = buildBlobPath(file.name, folder);
		const arrayBuffer = await file.arrayBuffer();

		return await put(pathname, arrayBuffer, {
			access: "public",
			contentType: file.type,
			addRandomSuffix: false,
		});
	},

	async getFiles(prefix = null) {
		const resolvedPrefix = normalizeFolder(prefix) || normalizeFolder(getBlobRootFolder());

		return await list({
			prefix: `${resolvedPrefix}/`,
			mode: "expanded",
		});
	},

	async deleteFile(url) {
		if (!url) {
			return createErrorResponse(400, "Нужен параметр url");
		}

		await del(url);

		return {
			url,
		};
	},
};
