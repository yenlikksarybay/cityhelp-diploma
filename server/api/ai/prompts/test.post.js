import { readBody, createError } from "h3";
import { PromptModel } from "../../../models/Prompt.js";
import { geminiService } from "../../../services/geminiService.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { promptId, input } = body || {};

	const prompt = await PromptModel.findById(promptId).lean();
	if (!prompt) {
		throw createError({ statusCode: 404, statusMessage: "Промт не найден" });
	}

	const result = await geminiService.generateJson({
		systemInstruction: prompt.systemPrompt,
		prompt: String(input || prompt.userTemplate || ""),
		temperature: 0.2,
	});

	return createSuccessResponse({
		message: "Промт протестирован",
		data: result,
	});
});
