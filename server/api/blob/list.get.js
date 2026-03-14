import { getBlobFiles } from "../../controllers/blobController.js";

export default defineEventHandler(async () => {
	return await getBlobFiles();
});
