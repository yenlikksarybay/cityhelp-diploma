import { createError } from "h3";

const DEFAULT_MODEL = "gemini-1.5-flash";

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

		const modelName = model || config.geminiModel || DEFAULT_MODEL;
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

		const imageParts = [];
		for (const image of images || []) {
			const part = await fetchImagePart(image).catch(() => null);
			if (part) {
				imageParts.push(part);
			}
		}

		const response = await $fetch(url, {
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
