import { uploadBlobFile } from "../../controllers/blobController.js";

export default defineEventHandler(async (event) => {
	return await uploadBlobFile(event);
});
