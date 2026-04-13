import { createError } from "h3";

const DEFAULT_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

const extractJson = (text = "") => {
	const trimmed = String(text || "").trim();

	try {
		return JSON.parse(trimmed);
	} catch {}

	const match = trimmed.match(/\{[\s\S]*\}/);
	if (!match) return null;

	try {
		return JSON.parse(match[0]);
	} catch {
		return null;
	}
};

const fetchImagePart = async (source) => {
	if (!source?.url) return null;

	const response = await fetch(source.url);
	if (!response.ok) {
		throw createError({
			statusCode: 502,
			statusMessage: `Не удалось загрузить изображение для AI: ${source.url}`,
		});
	}

	const contentType = response.headers.get("content-type") || source.type || "image/jpeg";
	const arrayBuffer = await response.arrayBuffer();

	return {
		inlineData: {
			mimeType: contentType.split(";")[0].trim(),
			data: Buffer.from(arrayBuffer).toString("base64"),
		},
	};
};

export const geminiService = {
	async generateJson({
		systemInstruction = "",
		prompt = "",
		model = null,
		temperature = 0.2,
		images = [],
	}) {
		const config = useRuntimeConfig();
		const apiKey = config.geminiApiKey;

		if (!apiKey) {
			throw createError({
				statusCode: 500,
				statusMessage: "GEMINI_API_KEY is not configured",
			});
		}

		const imageParts = [];
		for (const image of images || []) {
			const part = await fetchImagePart(image).catch(() => null);
			if (part) {
				imageParts.push(part);
			}
		}

		const requestedModel = model || config.geminiModel || DEFAULT_MODEL;
		const models = Array.from(
			new Set([requestedModel, ...FALLBACK_MODELS].map((item) => String(item || "").trim()).filter(Boolean)),
		);

		let response = null;
		let lastError = null;

		for (const modelName of models) {
			const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

			try {
				response = await $fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: {
						contents: [
							{
								role: "user",
								parts: [{ text: prompt }, ...imageParts],
							},
						],
						systemInstruction: systemInstruction
							? {
									parts: [{ text: systemInstruction }],
							  }
							: undefined,
						generationConfig: {
							temperature,
						},
					},
				});
				lastError = null;
				break;
			} catch (error) {
				lastError = error;
				const statusCode = error?.statusCode || error?.response?.status || error?.data?.status;
				const message = String(error?.statusMessage || error?.data?.message || error?.message || "");
				const isModelMissing = statusCode === 404 || /not found|not supported|invalid/i.test(message);
				if (!isModelMissing) {
					throw error;
				}
			}
		}

		if (!response) {
			throw lastError || createError({
				statusCode: 502,
				statusMessage: "Gemini request failed",
			});
		}

		const text = response?.candidates?.[0]?.content?.parts
			?.map((part) => part?.text || "")
			.join("\n");
		const json = extractJson(text);

		if (!json) {
			throw createError({
				statusCode: 502,
				statusMessage: "Gemini returned an invalid JSON response",
				data: { raw: text },
			});
		}

		return { raw: text, json };
	},
};
