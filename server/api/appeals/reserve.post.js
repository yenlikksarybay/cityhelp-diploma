import mongoose from "mongoose";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async () => {
	const appealId = new mongoose.Types.ObjectId().toString();

	return createSuccessResponse({
		message: "Идентификатор обращения создан",
		data: {
			appealId,
			folder: `cityhelp/appeals/${appealId}`,
		},
	});
});
