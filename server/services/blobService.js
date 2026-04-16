import { del, list, put } from "@vercel/blob";
import { createErrorResponse } from "../utils/createErrorResponse.js";
import { buildBlobPath } from "../utils/blobPath.js";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

const getBlobToken = () => {
	return (
		process.env.BLOB_READ_WRITE_TOKEN
	);
};

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

		const blobToken = getBlobToken();
		if (!blobToken) {
			return createErrorResponse(
				500,
				"BLOB token не задан. Установите переменную окружения BLOB_READ_WRITE_TOKEN или BLOB_TOKEN."
			);
		}

		const folder = resolveUploadFolder(options.folder);
		const pathname = buildBlobPath(file.name, folder);
		const arrayBuffer = await file.arrayBuffer();

		try {
			return await put(pathname, arrayBuffer, {
				access: "public",
				contentType: file.type,
				addRandomSuffix: false,
				token: blobToken,
			});
		} catch (error) {
			return createErrorResponse(
				500,
				`Ошибка загрузки в Blob: ${error?.message || "неопределённая ошибка"}`
			);
		}
	},

	async getFiles(prefix = null) {
		const blobToken = getBlobToken();
		if (!blobToken) {
			return createErrorResponse(
				500,
				"BLOB token не задан. Установите переменную окружения BLOB_READ_WRITE_TOKEN или BLOB_TOKEN."
			);
		}

		const resolvedPrefix = normalizeFolder(prefix) || normalizeFolder(getBlobRootFolder());

		try {
			return await list({
				prefix: `${resolvedPrefix}/`,
				mode: "expanded",
				token: blobToken,
			});
		} catch (error) {
			return createErrorResponse(
				500,
				`Ошибка получения списка Blob: ${error?.message || "неопределённая ошибка"}`
			);
		}
	},

	async deleteFile(url) {
		if (!url) {
			return createErrorResponse(400, "Нужен параметр url");
		}

		const blobToken = getBlobToken();
		if (!blobToken) {
			return createErrorResponse(
				500,
				"BLOB token не задан. Установите переменную окружения BLOB_READ_WRITE_TOKEN или BLOB_TOKEN."
			);
		}

		try {
			await del(url, { token: blobToken });
			return {
				url,
			};
		} catch (error) {
			return createErrorResponse(
				500,
				`Ошибка удаления Blob: ${error?.message || "неопределённая ошибка"}`
			);
		}
	},
};
