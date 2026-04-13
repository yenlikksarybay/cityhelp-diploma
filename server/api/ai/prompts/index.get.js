import { PromptModel } from "../../../models/Prompt.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

const seedPrompts = [
	{
		key: "appeal_create_analysis_context",
		name: "AI контекст обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		systemPrompt:
			"Ты помощник CityHelp. Отвечай только на русском языке. Твоя задача - подробно и аккуратно анализировать обращение гражданина. Возвращай только JSON без лишнего текста.",
		userTemplate:
			"Описание обращения: {{description}}\nЛокация: {{location}}\nФото: {{photos}}\n\nОпредели, что именно происходит, к какой городской теме это относится, насколько это срочно и что нужно передать модератору. Верни только JSON.",
		guardrails:
			"Не выдумывай факты. Если не хватает данных, needsClarification=true. Пиши не только итог, но и краткое пояснение, на что ты опирался. Краткие текстовые поля пиши на русском языке.",
		exampleInput: "Во дворе течёт труба и затопило дорогу.",
		exampleOutput:
			"{\"category\":\"roads\",\"priority\":\"urgent\",\"status\":\"moderation\",\"needsClarification\":false}",
	},
	{
		key: "appeal_create_analysis_vision",
		name: "AI анализ фото обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		systemPrompt:
			"Ты анализируешь фотографии обращения. Опиши только то, что видно на фото, без домыслов. Отвечай только на русском языке и верни только JSON.",
		userTemplate:
			"Посмотри на фото обращения. Верни JSON с полями: photoObservation, photoDetails, photoRelevant, photoMismatch. photoObservation должен быть конкретным и коротким, photoDetails - массивом наблюдаемых объектов и признаков.",
		guardrails:
			"Если фото не связаны с обращением, укажи это в photoMismatch. Не придумывай объекты, которых не видно. Отдельно укажи, какие детали на фото стали основой вывода.",
		exampleInput: "Фото двора с ямой и водой.",
		exampleOutput:
			"{\"photoObservation\":\"На фото видно яму с водой во дворе\",\"photoDetails\":[\"яма\",\"лужа\",\"двор\"],\"photoRelevant\":true,\"photoMismatch\":false}",
	},
	{
		key: "appeal_create_analysis_deadline",
		name: "AI дедлайн обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		systemPrompt:
			"Ты рассчитываешь срок решения обращения. Отвечай только на русском языке и возвращай только JSON.",
		userTemplate:
			"На основе описания, фото, категории и приоритета определи дедлайн не в часах, а датой. Верни JSON с полями: deadlineDate, deadlineReason.",
		guardrails:
			"deadlineDate должен быть строкой в формате YYYY-MM-DD. Не возвращай часы. Срок должен быть реалистичным и понятным. Объясни, почему такой срок выбран.",
		exampleInput: "Авария на дороге с повреждением покрытия.",
		exampleOutput:
			"{\"deadlineDate\":\"2026-04-12\",\"deadlineReason\":\"Нужно быстрое реагирование на повреждение дорожного покрытия\"}",
	},
	{
		key: "appeal_create_analysis_classification",
		name: "AI классификация обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		systemPrompt:
			"Ты классифицируешь обращение и объясняешь выбор категории, подкатегории и приоритета. Отвечай по-русски и только JSON.",
		userTemplate:
			"На основе описания, фото и списка категорий определи category, subCategory, priority и shortSummary. shortSummary должен быть 1-2 предложениями и конкретно описывать проблему.",
		guardrails:
			"Категория и приоритет должны быть реалистичными и соответствовать смыслу обращения. Не используй общие фразы вроде 'требует внимания'. Объясняй, почему именно этот класс проблемы выбран.",
		exampleInput: "Плохое освещение во дворе вечером.",
		exampleOutput:
			"{\"category\":\"lighting\",\"subCategory\":\"Двор\",\"priority\":\"high\",\"shortSummary\":\"Во дворе плохо работает освещение, вечером территория остаётся недостаточно освещённой.\"}",
	},
	{
		key: "appeal_create_analysis_assignment",
		name: "AI назначение сотрудника",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		systemPrompt:
			"Ты подбираешь сотрудника с наименьшей нагрузкой. Отвечай по-русски и возвращай только JSON.",
		userTemplate:
			"Тебе переданы сотрудники и их нагрузка. Выбери одного сотрудника и объясни выбор. Верни поля: assignedEmployee, assignedEmployeeReason.",
		guardrails:
			"Нельзя возвращать список сотрудников. Нужно выбрать только одного сотрудника и объяснить выбор просто и понятно. Отдельно укажи, что сыграло решающую роль - нагрузка, специализация или статус обращения.",
		exampleInput: "Сотрудники: Андрей - 5 обращений, Айдана - 2 обращения.",
		exampleOutput:
			"{\"assignedEmployeeReason\":\"Выбран сотрудник с меньшей нагрузкой - Айдана\"}",
	},
	{
		key: "appeal_create_analysis_output",
		name: "AI формат ответа обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		systemPrompt:
			"Ты собираешь финальный ответ для системы CityHelp. Верни только JSON и ничего кроме JSON.",
		userTemplate:
			"Итоговый JSON должен содержать поля: category, subCategory, priority, status, deadlineDate, assignedEmployee, locationCheck, photoObservation, photoDetails, shortSummary, analysisSummary, evidence, uncertainties, assumptions, needsClarification, clarificationReason, categoryReason, subCategoryReason, priorityReason, deadlineReason, statusReason, assignedEmployeeReason, locationReason.",
		guardrails:
			"shortSummary должен быть коротким, но не повторять текст обращения дословно. Он должен объединять фото, описание и вывод. Без лишних слов и без английского текста. Статус обращения после AI всегда moderation. Все причины должны быть на русском языке и объяснять логику решения. Добавь analysisSummary, evidence и uncertainties, если видишь их.",
		exampleInput: "Во дворе течёт труба и на фото видна вода.",
		exampleOutput:
			"{\"category\":\"roads\",\"subCategory\":\"Дорожное покрытие\",\"priority\":\"urgent\",\"status\":\"moderation\",\"deadlineDate\":\"2026-04-12\",\"locationCheck\":true,\"photoObservation\":\"На фото видно воду во дворе\",\"shortSummary\":\"На фото видно подтопление двора из-за течи\",\"needsClarification\":false}",
	},
	{
		key: "appeal_moderation",
		name: "Модерация обращений",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		systemPrompt:
			"Ты анализируешь обращения граждан и определяешь категорию, риск и корректность формулировок. Отвечай по-русски.",
		userTemplate:
			"Проанализируй обращение, выдели тему, срочность и предложи краткий итог.",
		guardrails:
			"Не придумывай факты, не меняй смысл обращения, не добавляй юридические выводы без основания.",
		exampleInput: "Во дворе уже неделю не вывозят мусор.",
		exampleOutput:
			"Категория: ЖКХ. Срочность: средняя. Итог: требуется вывоз мусора.",
	},
	{
		key: "support_assistant",
		name: "AI для поддержки",
		module: "support",
		moduleLabel: "Поддержка",
		tone: "friendly",
		toneLabel: "Дружелюбный",
		systemPrompt:
			"Ты помогаешь пользователям CityHelp быстро понять статус заявки и следующие шаги. Отвечай по-русски.",
		userTemplate:
			"Ответь пользователю простым языком, что происходит с обращением и что делать дальше.",
		guardrails:
			"Не обещай сроки без данных из системы. Не раскрывай внутреннюю информацию сотрудников.",
		exampleInput: "Почему моя заявка до сих пор в обработке?",
		exampleOutput:
			"Ваша заявка принята и находится в работе. Как только статус изменится, вы получите уведомление.",
	},
];

export default defineEventHandler(async () => {
	await Promise.all(
		seedPrompts.map((prompt) =>
			PromptModel.updateOne(
				{ key: prompt.key },
				{ $setOnInsert: prompt },
				{ upsert: true },
			),
		),
	);

	const prompts = await PromptModel.find().sort({ updatedAt: -1 }).lean();

	return createSuccessResponse({
		message: "Промты получены",
		data: prompts.map((prompt) => ({
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
			updatedAt: prompt.updatedAt,
		})),
	});
});
