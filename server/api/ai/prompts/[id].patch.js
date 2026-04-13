import { readBody, createError } from "h3";
import { PromptModel } from "../../../models/Prompt.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

const PROMPT_VERSION = 3;

export default defineEventHandler(async (event) => {
	const id = event.context.params?.id;
	const body = await readBody(event);
	const prompt = await PromptModel.findById(id);

	if (!prompt) {
		throw createError({ statusCode: 404, statusMessage: "Промт не найден" });
	}

	const fields = [
		"key",
		"name",
		"module",
		"moduleLabel",
		"tone",
		"toneLabel",
		"systemPrompt",
		"userTemplate",
		"guardrails",
		"exampleInput",
		"exampleOutput",
		"isActive",
	];

	fields.forEach((field) => {
		if (Object.prototype.hasOwnProperty.call(body || {}, field)) {
			prompt[field] = body[field];
		}
	});
	prompt.version = PROMPT_VERSION;

	await prompt.save();

	return createSuccessResponse({
		message: "Промт обновлён",
		data: {
			id: String(prompt._id),
			key: prompt.key,
			name: prompt.name,
			module: prompt.module,
			moduleLabel: prompt.moduleLabel,
			tone: prompt.tone,
			toneLabel: prompt.toneLabel,
			systemPrompt: prompt.systemPrompt,
			userTemplate: prompt.userTemplate,
			guardrails: prompt.guardrails,
			exampleInput: prompt.exampleInput,
			exampleOutput: prompt.exampleOutput,
			version: prompt.version,
			isActive: prompt.isActive !== false,
			updatedAt: prompt.updatedAt,
		},
	});
});
