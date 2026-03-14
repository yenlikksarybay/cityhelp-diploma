import { extname } from "node:path";

const slugifyFileName = (value = "") => {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9.-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
};

export const buildBlobPath = (fileName, folder = "images") => {
	const safeName = slugifyFileName(fileName || "upload");
	const extension = extname(safeName);
	const basename = extension ? safeName.slice(0, -extension.length) : safeName;
	const timestamp = Date.now();

	return `${folder}/${basename || "file"}-${timestamp}${extension}`;
};
