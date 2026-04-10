import { PromptModel } from "../../../models/Prompt.js";
import { createSuccessResponse } from "../../../utils/createSuccessResponse.js";

const seedPrompts = [
	{
		key: "appeal_create_analysis_core",
		name: "AI анализ обращения",
		module: "appeals",
		moduleLabel: "Обращения",
		tone: "strict",
		toneLabel: "Строгий",
		systemPrompt:
			"Ты помощник CityHelp. Отвечай только на русском языке и возвращай только JSON без лишнего текста.",
		userTemplate:
			"Описание обращения: {{description}}\nЛокация: {{location}}\nФото: {{photos}}\n\nОпредели категорию, срочность, статус и краткий итог. Верни только JSON.",
		guardrails:
			"Не выдумывай факты. Если не хватает данных, needsClarification=true. Краткие текстовые поля пиши на русском языке.",
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
			"Посмотри на фото обращения. Верни JSON с полями: photoObservation, photoDetails, photoRelevant, photoMismatch. photoObservation должен описывать, что видно на снимках, а shortSummary в итоговом анализе должен опираться на эти наблюдения.",
		guardrails:
			"Если фото не связаны с обращением, укажи это в photoMismatch. Не придумывай объекты, которых не видно.",
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
			"На основе описания, фото и категории определи дедлайн не в часах, а датой. Верни JSON с полями: deadlineDate, deadlineReason.",
		guardrails:
			"deadlineDate должен быть строкой в формате YYYY-MM-DD. Не возвращай часы. Срок должен быть реалистичным и понятным.",
		exampleInput: "Авария на дороге с повреждением покрытия.",
		exampleOutput:
			"{\"deadlineDate\":\"2026-04-12\",\"deadlineReason\":\"Нужно быстрое реагирование на повреждение дорожного покрытия\"}",
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
			"Итоговый JSON должен содержать поля: category, priority, status, deadlineDate, locationCheck, photoObservation, photoDetails, shortSummary, needsClarification, clarificationReason, categoryReason, priorityReason, deadlineReason, locationReason.",
		guardrails:
			"shortSummary должен быть коротким и основанным на том, что видно на фото и что указано в описании. Без лишних слов и без английского текста.",
		exampleInput: "Во дворе течёт труба и на фото видна вода.",
		exampleOutput:
			"{\"category\":\"roads\",\"priority\":\"urgent\",\"status\":\"moderation\",\"deadlineDate\":\"2026-04-12\",\"locationCheck\":true,\"photoObservation\":\"На фото видно воду во дворе\",\"shortSummary\":\"На фото видно подтопление двора из-за течи\",\"needsClarification\":false}",
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
