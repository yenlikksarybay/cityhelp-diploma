import { createError } from "h3";
import { PromptModel } from "../../../models/Prompt.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	const id = event.context.params?.id;
	const prompt = await PromptModel.findByIdAndDelete(id);

	if (!prompt) {
		throw createError({ statusCode: 404, statusMessage: "Промт не найден" });
	}

	return createSuccessResponse({
		message: "Промт удалён",
		data: { id: String(prompt._id) },
	});
});
