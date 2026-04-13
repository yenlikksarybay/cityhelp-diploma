import { createError } from "h3";
import { PromptModel } from "../models/Prompt.js";
import { AppealModel } from "../models/Appeal.js";
import { geminiService } from "../services/geminiService.js";

export const runAiPromptTest = async ({
  promptId,
  appealId = null,
  input = "",
}) => {
  const prompt = await PromptModel.findById(promptId).lean();
  if (!prompt) {
    throw createError({ statusCode: 404, statusMessage: "Промт не найден" });
  }

  let appeal = null;
  if (appealId) {
    appeal = await AppealModel.findById(appealId)
      .populate("user", "firstName lastName email phone role")
      .populate("assignedEmployee", "firstName lastName email phone role")
      .lean();

    if (!appeal) {
      throw createError({ statusCode: 404, statusMessage: "Обращение не найдено" });
    }
  }

  const appealDescription = appeal?.description || "";
  const appealLocation = appeal?.location || null;
  const appealPhotos = appeal?.photos || [];
  const promptInput = input
    ? String(input)
    : [
        `Описание: ${appealDescription}`,
        `Локация: ${JSON.stringify(appealLocation || {})}`,
        `Фото: ${JSON.stringify(appealPhotos || [])}`,
      ]
        .filter(Boolean)
        .join("\n");

  const result = await geminiService.generateJson({
    systemInstruction: [
      prompt.systemPrompt,
      prompt.guardrails,
      prompt.exampleInput ? `Пример входа: ${prompt.exampleInput}` : "",
      prompt.exampleOutput ? `Пример выхода: ${prompt.exampleOutput}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    prompt: [
      prompt.userTemplate,
      promptInput,
      appeal
        ? `Контекст обращения: ${JSON.stringify(
            {
              id: appeal.id,
              status: appeal.status,
              category: appeal.category,
              priority: appeal.priority,
            },
            null,
            2,
          )}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    temperature: 0.2,
    images: appealPhotos,
  });

  return {
    prompt,
    appeal,
    result,
  };
};
