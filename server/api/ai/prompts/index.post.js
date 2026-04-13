import { readBody, createError } from "h3";
import { PromptModel } from "../../../models/Prompt.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

const PROMPT_VERSION = 3;

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { key, name, module, moduleLabel, tone, toneLabel, systemPrompt, userTemplate, guardrails, exampleInput, exampleOutput } = body || {};

	if (!key?.trim() || !name?.trim()) {
		throw createError({ statusCode: 400, statusMessage: "Заполните key и name" });
	}

	const payload = {
		key: String(key).trim(),
		name: String(name).trim(),
		module: String(module || "").trim(),
		moduleLabel: String(moduleLabel || "").trim(),
		tone: String(tone || "").trim(),
		toneLabel: String(toneLabel || "").trim(),
		systemPrompt: String(systemPrompt || "").trim(),
		userTemplate: String(userTemplate || "").trim(),
		guardrails: String(guardrails || "").trim(),
		exampleInput: String(exampleInput || "").trim(),
		exampleOutput: String(exampleOutput || "").trim(),
		version: PROMPT_VERSION,
		isActive: true,
	};

	const exists = await PromptModel.findOne({ key: payload.key });
	if (exists) {
		throw createError({ statusCode: 409, statusMessage: "Промт с таким key уже существует" });
	}

	const prompt = await PromptModel.create(payload);

	return createSuccessResponse({
		message: "Промт сохранён",
		data: {
			id: String(prompt._id),
			...payload,
			updatedAt: prompt.updatedAt,
		},
	});
});
