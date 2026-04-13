import { createError } from "h3";
import { PromptModel } from "../models/Prompt.js";
import { AppealModel } from "../models/Appeal.js";
import { CategoryModel } from "../models/Category.js";
import { geminiService } from "../services/geminiService.js";
import { DEFAULT_CATEGORIES, CATEGORY_PLAYBOOK } from "../constants/knowledgeBase.js";

const formatCategoryContext = (categories = []) => {
  const playbookMap = new Map((CATEGORY_PLAYBOOK || []).map((item) => [item.key, item]));

  return (Array.isArray(categories) ? categories : [])
    .map((category) => {
      const playbook = playbookMap.get(category.key) || {};
      return [
        `- ${category.key}: ${category.name}`,
        category.description ? `  описание: ${category.description}` : "",
        Array.isArray(category.subcategories) && category.subcategories.length
          ? `  подкатегории: ${category.subcategories.join(", ")}`
          : "",
        Array.isArray(playbook.signs) && playbook.signs.length
          ? `  признаки: ${playbook.signs.join("; ")}`
          : "",
        Array.isArray(playbook.notThisCategory) && playbook.notThisCategory.length
          ? `  не относится: ${playbook.notThisCategory.join("; ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
};

const replacePromptVariables = (template = "", payload = {}) =>
  String(template || "")
    .replaceAll("{{description}}", payload.description || "")
    .replaceAll("{{location}}", JSON.stringify(payload.location || {}))
    .replaceAll("{{photos}}", JSON.stringify(payload.photos || []))
    .replaceAll("{{vision}}", JSON.stringify(payload.vision || {}))
    .replaceAll("{{categoryContext}}", payload.categoryContext || "")
    .replaceAll("{{aiResult}}", JSON.stringify(payload.aiResult || {}))
    .replaceAll("{{appealId}}", payload.appealId || "");

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
  const categoryDocs = await CategoryModel.find({ isActive: true }).sort({ order: 1 }).lean();
  const categories = categoryDocs.length ? categoryDocs : DEFAULT_CATEGORIES;
  const categoryContext = formatCategoryContext(categories);
  const aiResult = appeal?.aiResult || {};
  const vision = {
    photoObservation: aiResult.photoObservation || "",
    photoDetails: aiResult.photoDetails || [],
    photoRelevant: aiResult.photoRelevant,
    photoMismatch: aiResult.photoMismatch,
    confidencePhoto: aiResult.confidencePhoto,
  };
  const promptInput = input
    ? String(input)
    : [
        `Описание: ${appealDescription}`,
        `Локация: ${JSON.stringify(appealLocation || {})}`,
        `Фото: ${JSON.stringify(appealPhotos || [])}`,
        `AI-наблюдение по фото: ${JSON.stringify(vision)}`,
        `Текущий AI результат: ${JSON.stringify(aiResult)}`,
        `Справочник категорий:\n${categoryContext}`,
      ]
        .filter(Boolean)
        .join("\n");
  const promptPayload = {
    description: appealDescription,
    location: appealLocation,
    photos: appealPhotos,
    vision,
    categoryContext,
    aiResult,
    appealId: appeal ? String(appeal._id) : "",
  };

  const result = await geminiService.generateJson({
    systemInstruction: [
      replacePromptVariables(prompt.systemPrompt, promptPayload),
      replacePromptVariables(prompt.guardrails, promptPayload),
      prompt.exampleInput ? `Пример входа: ${prompt.exampleInput}` : "",
      prompt.exampleOutput ? `Пример выхода: ${prompt.exampleOutput}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    prompt: [
      replacePromptVariables(prompt.userTemplate, promptPayload),
      promptInput,
      appeal
        ? `Контекст обращения: ${JSON.stringify(
            {
              id: appeal.id,
              status: appeal.status,
              category: appeal.category,
              subCategory: appeal.subCategory,
              priority: appeal.priority,
              confidenceCategory: aiResult.confidenceCategory,
              confidencePriority: aiResult.confidencePriority,
              confidencePhoto: aiResult.confidencePhoto,
              candidateCategories: aiResult.candidateCategories || [],
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
    meta: {
      promptVersion: prompt.version || 1,
      categoriesCount: categories.length,
      pipelineVersion: aiResult.analysisPipelineVersion || "",
    },
  };
};
