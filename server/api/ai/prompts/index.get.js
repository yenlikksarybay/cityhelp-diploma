import { PromptModel } from "../../../models/Prompt.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

const PROMPT_VERSION = 4;

const seedPrompts = [
	{
		key: "appeal_create_analysis_validity",
		name: "AI проверка валидности обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		isActive: true,
		systemPrompt:
			"Ты проверяешь, является ли обращение гражданина реальной городской проблемой. Отвечай только на русском языке и только JSON. Если на фото нет признаков городской проблемы, а изображён человек, селфи, шутка, мем, случайная сцена или несвязанный объект, не классифицируй это как нормальное обращение.",
		userTemplate:
			"Проверь обращение на валидность.\nОписание: {{description}}\nЛокация: {{location}}\nФото: {{photos}}\n\nВерни JSON с полями: isValidAppeal, validityReason, abuseScore, relevanceScore, containsHumanPortrait, containsCityProblem, textPhotoConsistency, rejectionRecommendation, rejectionReason, uncertainties.",
		guardrails:
			"Не выдумывай проблему, если на фото её нет. Если изображён человек крупным планом и нет городской неисправности, это сильный сигнал нерелевантного обращения. Если текст и фото противоречат друг другу, укажи это. Если данных мало, не отклоняй автоматически, а отправляй на ручную проверку.",
		exampleInput: "Описание: Во дворе мусор. На фото видно человека крупным планом без мусора и городской проблемы.",
		exampleOutput:
			"{\"isValidAppeal\":false,\"validityReason\":\"На фото не видно признаков городской проблемы, в кадре в основном человек крупным планом.\",\"abuseScore\":0.94,\"relevanceScore\":0.12,\"containsHumanPortrait\":true,\"containsCityProblem\":false,\"textPhotoConsistency\":0.08,\"rejectionRecommendation\":\"likely_fake_or_irrelevant\",\"rejectionReason\":\"Фото не подтверждает проблему и выглядит нерелевантным для городского обращения.\",\"uncertainties\":[]}",
	},
	{
		key: "appeal_create_analysis_context",
		name: "AI контекст обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		isActive: true,
		systemPrompt:
			"Ты помощник CityHelp. Отвечай только на русском языке. Анализируй обращение гражданина по фото, описанию, локации и shortlist категорий. Верни только JSON без лишнего текста.",
		userTemplate:
			"Описание обращения: {{description}}\nЛокация: {{location}}\nAI-наблюдение по фото: {{vision}}\nShortlist категорий:\n{{categoryContext}}\n\nСделай осмысленный разбор проблемы. Не копируй текст пользователя дословно. Используй фото-наблюдения, если они переданы.",
		guardrails:
			"Не выдумывай факты. Если данных мало, заполни uncertainties и needsClarification. Все reason-поля должны быть содержательными. Не выбирай status, deadlineAt, assignedEmployee и locationCheck: это делает система.",
		exampleInput: "Во дворе течёт труба и затопило дорогу.",
		exampleOutput:
			"{\"category\":\"housing\",\"subCategory\":\"Вода\",\"priority\":\"high\",\"confidenceCategory\":0.86,\"confidencePriority\":0.78,\"needsClarification\":false}",
	},
	{
		key: "appeal_create_analysis_vision",
		name: "AI анализ фото обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		isActive: true,
		systemPrompt:
			"Ты анализируешь фотографии городского обращения. Опиши только то, что видно на фото, без домыслов. Отвечай только на русском языке и верни только JSON.",
		userTemplate:
			"Описание пользователя: {{description}}\n\nВерни JSON с полями: photoObservation, photoDetails, photoRelevant, photoMismatch, confidencePhoto, containsPerson, isSelfie, sceneType, textPhotoConflictReason, fraudSignals, uncertainties. confidencePhoto - число от 0 до 1. Если фото похоже на личное селфи, портрет или кадр, не подтверждающий проблему, явно укажи это в isSelfie, photoMismatch, textPhotoConflictReason и fraudSignals.",
		guardrails:
			"Не повторяй комментарий пользователя вместо анализа фото. Не придумывай невидимые объекты. Если фото не связано с текстом обращения, поставь photoMismatch=true и объясни несоответствие. Если на фото в основном человек или селфи вместо городской проблемы, обязательно отметь риск ложного обращения.",
		exampleInput: "Фото двора с ямой и водой.",
		exampleOutput:
			"{\"photoObservation\":\"На фото видно яму с водой во дворе\",\"photoDetails\":[\"яма\",\"лужа\",\"дворовая территория\"],\"photoRelevant\":true,\"photoMismatch\":false,\"confidencePhoto\":0.84,\"containsPerson\":false,\"isSelfie\":false,\"sceneType\":\"городская проблема\",\"textPhotoConflictReason\":\"\",\"fraudSignals\":[],\"uncertainties\":[\"по фото нельзя точно оценить глубину\"]}",
	},
	{
		key: "appeal_create_analysis_classification",
		name: "AI классификация обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		isActive: true,
		systemPrompt:
			"Ты классифицируешь обращение и объясняешь выбор категории, подкатегории и приоритета. Отвечай по-русски и только JSON. Выбирай category только из переданного shortlist категорий и subCategory только из допустимых подкатегорий выбранной категории.",
		userTemplate:
			"На основе описания, фото, фотонаблюдений и shortlist категорий определи category, subCategory, priority, confidenceCategory, confidencePriority и shortSummary. Добавь userSummary, moderatorSummary, employeeSummary, evidence, uncertainties, assumptions и развернутые reason-поля. Если фотонаблюдение показывает несоответствие текста и изображения, не делай уверенную узкую классификацию.",
		guardrails:
			"Не используй general, если подходит узкая категория из shortlist. Но если фото не подтверждает проблему, используй general/Уточнение и needsClarification=true. confidenceCategory и confidencePriority должны быть числами от 0 до 1. shortSummary не должен быть копией описания пользователя.",
		exampleInput: "Плохое освещение во дворе вечером.",
		exampleOutput:
			"{\"category\":\"lighting\",\"subCategory\":\"Двор\",\"priority\":\"high\",\"confidenceCategory\":0.87,\"confidencePriority\":0.74,\"shortSummary\":\"Во дворе недостаточно освещения, поэтому территория вечером выглядит небезопасной.\",\"moderatorSummary\":\"Категория lighting выбрана по признакам слабого освещения двора.\",\"employeeSummary\":\"Проверить работу фонаря и уровень освещенности участка.\"}",
	},
	{
		key: "appeal_create_analysis_playbook",
		name: "AI категорийный справочник",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		isActive: true,
		systemPrompt:
			"Ты пользуешься внутренним справочником CityHelp для точной классификации обращений. Отвечай только на русском языке и только JSON.",
		userTemplate:
			"Справочник категорий и примеров:\n{{categoryContext}}\n\nИспользуй этот справочник как опору. Отделяй похожие категории по сути, а не по отдельным словам. Если обращение похоже сразу на несколько категорий, выбери ту, которая лучше объясняет фото и текст, и кратко опиши, почему другие варианты хуже.",
		guardrails:
			"Не выдумывай категории, которых нет в shortlist. roads - повреждение покрытия и безопасность дороги; housing - дом, двор, подъезд и коммуникации; lighting - освещение; waste - мусор и санитарное состояние; general - только если узкой категории действительно нет.",
		exampleInput:
			"roads: ямы, трещины, провал, разметка, дорожные знаки\nhousing: двор, подъезд, вода, отопление\nlighting: тёмный двор, фонарь не горит\nwaste: контейнеры, свалка, мусорная площадка\ngeneral: несколько проблем или недостаточно данных",
		exampleOutput:
			"{\"selected\":\"roads\",\"why\":\"Проблема связана с дорожным покрытием\",\"notSelected\":\"lighting не выбрана, потому что основной дефект не в освещении\"}",
	},
	{
		key: "appeal_create_analysis_output",
		name: "AI формат ответа обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		isActive: true,
		systemPrompt:
			"Ты собираешь финальный смысловой ответ для системы CityHelp. Верни только JSON и ничего кроме JSON. Каждый вывод должен быть конкретным, подробным и связанным с фото, описанием и локацией.",
		userTemplate:
			"Итоговый JSON должен содержать только смысловые AI-поля: category, subCategory, priority, confidenceCategory, confidencePriority, shortSummary, analysisSummary, userSummary, moderatorSummary, employeeSummary, evidence, uncertainties, assumptions, needsClarification, clarificationReason, categoryReason, subCategoryReason, priorityReason, textPhotoConflictReason, fraudSignals.",
		guardrails:
			"Не добавляй status, deadlineAt, assignedEmployee, deadlineReason, statusReason, assignedEmployeeReason и locationCheck: это делает система. Не оставляй reason-поля пустыми. Без английского текста.",
		exampleInput: "Во дворе течёт труба и на фото видна вода.",
		exampleOutput:
			"{\"category\":\"housing\",\"subCategory\":\"Вода\",\"priority\":\"high\",\"confidenceCategory\":0.82,\"confidencePriority\":0.76,\"shortSummary\":\"На фото видно подтопление двора, вероятно связанное с коммунальной проблемой.\",\"needsClarification\":false}",
	},
	{
		key: "appeal_moderation",
		name: "Модерация обращений",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		isActive: true,
		systemPrompt:
			"Ты помогаешь модератору CityHelp проверить обращение, AI-вывод и риски ложной заявки. Отвечай по-русски.",
		userTemplate:
			"Проанализируй обращение, AI-результат, confidence и признаки на фото. Подскажи, можно ли подтверждать модерацию или нужно отклонить/уточнить.",
		guardrails:
			"Не меняй факты без основания. Если confidence низкий или фото не подтверждает текст, явно предупреди модератора.",
		exampleInput: "AI выбрал roads, но фото показывает мусорный контейнер.",
		exampleOutput:
			"{\"moderationHint\":\"Нужно внимательно проверить категорию: фото больше похоже на waste, чем roads.\",\"risk\":\"possible_mismatch\"}",
	},
	{
		key: "support_assistant",
		name: "AI для поддержки",
		module: "support",
		moduleLabel: "Поддержка",
		tone: "friendly",
		toneLabel: "Дружелюбный",
		isActive: true,
		systemPrompt:
			"Ты помогаешь пользователям CityHelp быстро понять статус обращения и следующие шаги. Отвечай по-русски.",
		userTemplate:
			"Ответь пользователю простым языком, что происходит с обращением и что делать дальше.",
		guardrails:
			"Не обещай сроки без данных из системы. Не раскрывай внутреннюю информацию сотрудников. Если обращение отклонено, объясняй спокойно и без обвинений.",
		exampleInput: "Почему моя заявка до сих пор на модерации?",
		exampleOutput:
			"Ваше обращение проверяет модератор. Это нужно, чтобы подтвердить категорию, фото и корректность данных перед передачей сотруднику.",
	},
];

const legacyPromptSeeds = [
	{
		key: "appeal_create_analysis_deadline",
		name: "Архив: AI дедлайн обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		isActive: false,
		systemPrompt:
			"Архивный промт. В актуальном v4-пайплайне deadlineAt рассчитывает сервер по приоритету, а не Gemini.",
		userTemplate:
			"Этот промт оставлен только для истории. Не используется в активном анализе обращения.",
		guardrails:
			"Не включать в active AI pipeline. Дедлайн должен оставаться системным правилом.",
		exampleInput: "",
		exampleOutput: "",
	},
	{
		key: "appeal_create_analysis_assignment",
		name: "Архив: AI назначение сотрудника",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		isActive: false,
		systemPrompt:
			"Архивный промт. В актуальном v4-пайплайне сотрудника выбирает сервер по нагрузке, а не Gemini.",
		userTemplate:
			"Этот промт оставлен только для истории. Не используется в активном анализе обращения.",
		guardrails:
			"Не включать в active AI pipeline. Назначение сотрудника должно оставаться системным правилом.",
		exampleInput: "",
		exampleOutput: "",
	},
];

const mapPrompt = (prompt) => ({
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
	version: prompt.version || 1,
	isActive: prompt.isActive !== false,
	updatedAt: prompt.updatedAt,
});

export default defineEventHandler(async () => {
	const promptsToSeed = [...seedPrompts, ...legacyPromptSeeds];

	await Promise.all(
		promptsToSeed.map((prompt) =>
			PromptModel.updateOne(
				{ key: prompt.key },
				{ $set: { ...prompt, version: PROMPT_VERSION } },
				{ upsert: true },
			),
		),
	);

	const prompts = await PromptModel.find().sort({ isActive: -1, module: 1, key: 1 }).lean();

	return createSuccessResponse({
		message: "Промты получены",
		data: prompts.map(mapPrompt),
	});
});
