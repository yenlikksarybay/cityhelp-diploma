import { deleteBlobFile } from "../../controllers/blobController.js";

export default defineEventHandler(async (event) => {
	return await deleteBlobFile(event);
});
