import { readBody } from "h3";
import { runAiPromptTest } from "../../../utils/aiPromptTest.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { promptId, appealId, input } = body || {};
	const { prompt, appeal, result } = await runAiPromptTest({
		promptId,
		appealId,
		input,
	});

	return createSuccessResponse({
		message: "Промт протестирован",
		data: {
			prompt: {
				id: String(prompt._id),
				key: prompt.key,
				name: prompt.name,
				module: prompt.module,
				tone: prompt.tone,
			},
			appeal: appeal
				? {
						id: String(appeal._id),
						description: appeal.description,
						category: appeal.category,
						priority: appeal.priority,
						status: appeal.status,
						location: appeal.location,
						photosCount: Array.isArray(appeal.photos) ? appeal.photos.length : 0,
				  }
				: null,
			result,
		},
	});
});
