import { PromptModel } from "../../../models/Prompt.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

const PROMPT_VERSION = 2;

const seedPrompts = [
	{
		key: "appeal_create_analysis_context",
		name: "AI контекст обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
			systemPrompt:
				"Ты помощник CityHelp. Отвечай только на русском языке. Твоя задача - подробно и аккуратно анализировать обращение гражданина, опираясь на фото, описание и локацию. Возвращай только JSON без лишнего текста. Заполняй все смысловые поля максимально полно и не оставляй reason-поля пустыми.",
			userTemplate:
				"Описание обращения: {{description}}\nЛокация: {{location}}\nФото: {{photos}}\nКатегории:\n{{categoryContext}}\n\nОпредели, что именно происходит, к какой городской теме это относится, насколько это срочно и что нужно передать модератору. Верни только JSON. Не копируй текст обращения дословно. Дай конкретику: что видно, почему это важно, что нужно проверить человеку.",
			guardrails:
				"Не выдумывай факты. Если не хватает данных, needsClarification=true. Сначала опиши, что видно на фото, затем уже логику вывода. Краткие текстовые поля пиши на русском языке. Статус обращения после AI всегда moderation. Обязательные поля для содержательного ответа: photoObservation, photoDetails, shortSummary, analysisSummary, evidence, uncertainties, assumptions, categoryReason, subCategoryReason, priorityReason, deadlineReason, statusReason, assignedEmployeeReason, locationReason. Если данных мало, объясни, чего именно не хватает, а не оставляй пустую строку.",
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
				"Ты анализируешь фотографии обращения. Опиши только то, что видно на фото, без домыслов. Отвечай только на русском языке и верни только JSON. Дай не менее 3-5 полезных наблюдений, если это возможно.",
			userTemplate:
				"Посмотри на фото обращения. Верни JSON с полями: photoObservation, photoDetails, photoRelevant, photoMismatch. photoObservation должен быть конкретным и коротким, photoDetails - массивом наблюдаемых объектов, повреждений, следов и других видимых признаков. Если на фото есть детали, которые помогают понять категорию, укажи их. Не ограничивайся одним общим словом, если на фото видно больше.",
			guardrails:
				"Если фото не связаны с обращением, укажи это в photoMismatch. Не придумывай объекты, которых не видно. Отдельно укажи, какие детали на фото стали основой вывода. Не копируй текст описания пользователя. Если фото размытое или малоинформативное, прямо скажи об этом и объясни, что мешает точному выводу.",
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
				"Ты рассчитываешь срок решения обращения. Отвечай только на русском языке и возвращай только JSON. Указывай точное время до минуты. Объясняй дедлайн через срочность, риск и объём работ.",
			userTemplate:
				"На основе описания, фото, категории и приоритета определи дедлайн не в часах, а датой и временем. Верни JSON с полями: deadlineAt, deadlineReason. deadlineReason должен объяснять, почему срок именно такой и почему он не может быть короче или длиннее.",
			guardrails:
				"deadlineAt должен быть строкой в формате YYYY-MM-DD HH:mm. Не возвращай часы отдельно. Срок должен быть реалистичным и понятным. Объясни, почему такой срок выбран. Не оставляй deadlineReason пустым.",
		exampleInput: "Авария на дороге с повреждением покрытия.",
		exampleOutput:
			"{\"deadlineAt\":\"2026-04-12 18:30\",\"deadlineReason\":\"Нужно быстрое реагирование на повреждение дорожного покрытия\"}",
	},
	{
		key: "appeal_create_analysis_classification",
		name: "AI классификация обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
			systemPrompt:
				"Ты классифицируешь обращение и объясняешь выбор категории, подкатегории и приоритета. Отвечай по-русски и только JSON. Выбирай category только из переданного списка категорий и subCategory только из допустимых подкатегорий выбранной категории. Дай подробное объяснение выбора, а не одно короткое слово.",
			userTemplate:
				"На основе описания, фото, фотонаблюдений и списка категорий определи category, subCategory, priority и shortSummary. shortSummary должен быть 1-2 предложениями и конкретно описывать проблему. Не повторяй дословно текст обращения пользователя. shortSummary должен опираться на фото и итог анализа. categoryReason, subCategoryReason и priorityReason должны быть развернутыми и разными по смыслу.",
			guardrails:
				"Категория и приоритет должны быть реалистичными и соответствовать смыслу обращения. Не используй общие фразы вроде 'требует внимания'. Объясняй, почему именно этот класс проблемы выбран. Если ничего не подходит, используй general и Прочее. Не оставляй categoryReason, subCategoryReason и priorityReason пустыми.",
		exampleInput: "Плохое освещение во дворе вечером.",
		exampleOutput:
			"{\"category\":\"lighting\",\"subCategory\":\"Двор\",\"priority\":\"high\",\"shortSummary\":\"На фото видно, что во дворе недостаточно освещения, поэтому вечером территория остаётся тёмной.\"}",
	},
	{
		key: "appeal_create_analysis_playbook",
		name: "AI категорийный справочник",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		systemPrompt:
			"Ты пользуешься внутренним справочником CityHelp для точной классификации обращений. Отвечай только на русском языке и только JSON. Примеров должно хватить, чтобы различать похожие темы по смыслу и фото.",
		userTemplate:
			"Справочник категорий и примеров:\n{{categoryContext}}\n\nИспользуй этот справочник как опору. Отделяй похожие категории по сути, а не по отдельным словам. Если обращение похоже сразу на несколько категорий, выбери ту, которая лучше объясняет фото и текст, и кратко опиши, почему другие варианты хуже.",
		guardrails:
			"Не выдумывай категории, которых нет в списке. Если ситуация пограничная, используй general и Прочее, но объясни почему. roads - повреждение покрытия и безопасность дороги; housing - дом, двор, подъезд и коммуникации; lighting - освещение; waste - мусор и санитарное состояние; general - только если узкой категории действительно нет.",
		exampleInput:
			"roads: ямы, трещины, провал, стертая разметка, дорожные знаки\nhousing: мусор во дворе, протечка, подъезд, отопление, двор\nlighting: тёмный двор, фонарь не горит, слабое освещение\nwaste: переполненный контейнер, свалка, мусорная площадка\ngeneral: несколько проблем сразу или недостаточно данных",
		exampleOutput:
			"{\"roads\":\"Подходит для повреждения дороги или знаков\",\"housing\":\"Подходит для двора, подъезда и коммуникаций\",\"lighting\":\"Подходит для проблем со светом\",\"waste\":\"Подходит для мусора и санитарного состояния\",\"general\":\"Подходит только если узкой категории нет\"}",
	},
	{
		key: "appeal_create_analysis_assignment",
		name: "AI назначение сотрудника",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
			systemPrompt:
				"Ты подбираешь сотрудника с наименьшей нагрузкой. Отвечай по-русски и возвращай только JSON. Объясняй выбор понятным человеческим языком.",
			userTemplate:
				"Тебе переданы сотрудники и их нагрузка. Выбери одного сотрудника и объясни выбор. Верни поля: assignedEmployee, assignedEmployeeReason. assignedEmployeeReason должен содержать нагрузку, почему выбран этот сотрудник и почему он подходит именно этому обращению.",
			guardrails:
				"Нельзя возвращать список сотрудников. Нужно выбрать только одного сотрудника и объяснить выбор просто и понятно. Отдельно укажи, что сыграло решающую роль - нагрузка, специализация или статус обращения. Не оставляй assignedEmployeeReason пустым.",
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
				"Ты собираешь финальный ответ для системы CityHelp. Верни только JSON и ничего кроме JSON. Каждый вывод должен быть конкретным, подробным и связанным с фото, описанием и локацией.",
			userTemplate:
				"Итоговый JSON должен содержать поля: category, subCategory, priority, status, deadlineAt, assignedEmployee, locationCheck, photoObservation, photoDetails, shortSummary, analysisSummary, evidence, uncertainties, assumptions, needsClarification, clarificationReason, categoryReason, subCategoryReason, priorityReason, deadlineReason, statusReason, assignedEmployeeReason, locationReason. Все reason-поля должны быть заполнены осмысленно. analysisSummary должен быть развернутым и объяснять логику целиком.",
			guardrails:
				"shortSummary должен быть коротким, но не повторять текст обращения дословно. Он должен объединять фото, описание и вывод. Без лишних слов и без английского текста. Статус обращения после AI всегда moderation. Все причины должны быть на русском языке и объяснять логику решения. Добавь analysisSummary, evidence и uncertainties, если видишь их. photoObservation должен описывать именно фото, а не комментарий пользователя. Не оставляй categoryReason, subCategoryReason, priorityReason, deadlineReason, statusReason, assignedEmployeeReason и locationReason пустыми.",
		exampleInput: "Во дворе течёт труба и на фото видна вода.",
		exampleOutput:
			"{\"category\":\"roads\",\"subCategory\":\"Дорожное покрытие\",\"priority\":\"urgent\",\"status\":\"moderation\",\"deadlineAt\":\"2026-04-12 18:30\",\"locationCheck\":true,\"photoObservation\":\"На фото видно воду во дворе и признаки подтопления\",\"shortSummary\":\"На фото видно подтопление двора из-за течи\",\"needsClarification\":false}",
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
					{ $set: { ...prompt, version: PROMPT_VERSION } },
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
				version: prompt.version || 1,
				updatedAt: prompt.updatedAt,
			})),
	});
});
