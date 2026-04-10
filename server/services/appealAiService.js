import { PromptModel } from "../models/Prompt.js";
import { AppealModel } from "../models/Appeal.js";
import { UserModel } from "../models/User.js";
import { geminiService } from "./geminiService.js";
import { APPEAL_STATUSES, APPEAL_PRIORITIES } from "../constants/appeal.js";

const ANALYSIS_PROMPT_KEYS = [
	"appeal_create_analysis_core",
	"appeal_create_analysis_vision",
	"appeal_create_analysis_deadline",
	"appeal_create_analysis_output",
];

const DEFAULT_ANALYSIS_PROMPTS = {
	appeal_create_analysis_core: {
		systemPrompt:
			"Ты помощник CityHelp. Отвечай только на русском языке и возвращай только JSON без лишнего текста.",
		userTemplate:
			"Описание обращения: {{description}}\nЛокация: {{location}}\nФото: {{photos}}\n\nОпредели категорию, срочность, статус и краткий итог.",
		guardrails:
			"Не выдумывай факты. Если не хватает данных, needsClarification=true. Краткие текстовые поля пиши на русском языке.",
	},
	appeal_create_analysis_vision: {
		systemPrompt:
			"Ты анализируешь фотографии обращения. Опиши только то, что видно на фото, без домыслов. Отвечай только на русском языке и возвращай только JSON.",
		userTemplate:
			"Посмотри на фото обращения. Верни JSON с полями: photoObservation, photoDetails, photoRelevant, photoMismatch.",
		guardrails:
			"Если фото не связаны с обращением, укажи это в photoMismatch. Не придумывай объекты, которых не видно.",
	},
	appeal_create_analysis_deadline: {
		systemPrompt:
			"Ты рассчитываешь срок решения обращения. Отвечай только на русском языке и возвращай только JSON.",
		userTemplate:
			"На основе описания, фото и категории определи дедлайн не в часах, а датой. Верни JSON с полями: deadlineDate, deadlineReason.",
		guardrails:
			"deadlineDate должен быть строкой в формате YYYY-MM-DD. Не возвращай часы. Срок должен быть реалистичным и понятным.",
	},
	appeal_create_analysis_output: {
		systemPrompt:
			"Ты собираешь финальный ответ для системы CityHelp. Верни только JSON и ничего кроме JSON.",
		userTemplate:
			"Итоговый JSON должен содержать поля: category, priority, status, deadlineDate, locationCheck, photoObservation, photoDetails, shortSummary, needsClarification, clarificationReason, categoryReason, priorityReason, deadlineReason, locationReason.",
		guardrails:
			"shortSummary должен быть коротким и основанным на том, что видно на фото и что указано в описании. Без лишних слов и без английского текста.",
	},
};

const getPromptText = (template, payload) => {
	return String(template || "")
		.replaceAll("{{description}}", payload.description || "")
		.replaceAll("{{location}}", JSON.stringify(payload.location || {}))
		.replaceAll("{{photos}}", JSON.stringify(payload.photos || []))
		.replaceAll("{{employees}}", JSON.stringify(payload.employees || []));
};

const getDeadlineDate = (days) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date.toISOString().slice(0, 10);
};

const fallbackAnalysis = ({ description, location }) => {
	const normalized = String(description || "").toLowerCase();

	let category = "general";
	let priority = "medium";
	if (normalized.includes("мусор") || normalized.includes("отход")) category = "waste";
	if (normalized.includes("яма") || normalized.includes("дорог")) category = "roads";
	if (normalized.includes("свет") || normalized.includes("фонар")) category = "lighting";
	if (normalized.length > 180) priority = "high";
	if (normalized.includes("авар") || normalized.includes("опас")) priority = "urgent";

	const deadlineDays = priority === "urgent" ? 1 : priority === "high" ? 3 : 7;

	return {
		category,
		priority,
		status: "moderation",
		deadlineDate: getDeadlineDate(deadlineDays),
		locationCheck: Boolean(location?.x && location?.y),
		photoObservation: "",
		photoDetails: [],
		shortSummary: description?.slice(0, 160) || "",
		needsClarification: false,
		clarificationReason: "",
		categoryReason: "",
		priorityReason: "",
		deadlineReason: "",
		locationReason: "",
	};
};

const countOpenAppealsByEmployee = async () => {
	const counts = await AppealModel.aggregate([
		{
			$match: {
				assignedEmployee: { $ne: null },
				status: { $nin: ["completed", "rated"] },
			},
		},
		{
			$group: {
				_id: "$assignedEmployee",
				total: { $sum: 1 },
			},
		},
	]);

	return new Map(counts.map((item) => [String(item._id), item.total]));
};

const pickLeastBusyEmployee = async () => {
	const employees = await UserModel.find({ role: "employee", isActive: true })
		.select("_id firstName lastName role")
		.lean();

	if (!employees.length) return null;

	const counts = await countOpenAppealsByEmployee();

	return employees
		.map((employee) => {
			const id = String(employee._id);
			return {
				id,
				name: `${employee.firstName || ""} ${employee.lastName || ""}`.trim(),
				load: counts.get(id) || 0,
			};
		})
		.sort((a, b) => a.load - b.load || a.name.localeCompare(b.name, "ru"))
		[0];
};

export const appealAiService = {
	async analyzeAppeal(payload = {}) {
		const promptDocs = await PromptModel.find({
			key: { $in: ANALYSIS_PROMPT_KEYS },
			isActive: true,
		}).lean();

		const promptMap = new Map(promptDocs.map((prompt) => [prompt.key, prompt]));

		const chosenEmployee = await pickLeastBusyEmployee();
		const prompts = ANALYSIS_PROMPT_KEYS.map((key) => ({
			...DEFAULT_ANALYSIS_PROMPTS[key],
			...(promptMap.get(key) || {}),
		}));

		try {
			const systemInstruction = prompts
				.map((prompt) =>
					[
						prompt.systemPrompt,
						prompt.guardrails,
						prompt.exampleInput ? `Пример входа: ${prompt.exampleInput}` : "",
						prompt.exampleOutput ? `Пример выхода: ${prompt.exampleOutput}` : "",
					]
						.filter(Boolean)
						.join("\n"),
				)
				.filter(Boolean)
				.join("\n\n");

			const userPrompt = [
				...prompts.map((prompt) =>
					getPromptText(prompt.userTemplate, {
						description: payload.description,
						location: payload.location,
						photos: payload.photos,
					}),
				),
				`Дополнительные данные:\n${JSON.stringify(
					{
						description: payload.description,
						location: payload.location,
						photoCount: Array.isArray(payload.photos) ? payload.photos.length : 0,
						employeeLoadHint: chosenEmployee ? chosenEmployee.load : null,
					},
					null,
					2,
				)}`,
				"Верни итоговый JSON на русском языке. shortSummary должен описывать то, что видно на фото и что указано в описании. deadlineDate укажи в формате YYYY-MM-DD.",
			]
				.filter(Boolean)
				.join("\n\n");

			const result = await geminiService.generateJson({
				systemInstruction,
				prompt: userPrompt,
				temperature: 0.2,
				images: payload.photos || [],
			});

			const deadlineDate = String(result.json.deadlineDate || "").trim();

			return {
				...fallbackAnalysis({
					description: payload.description,
					location: payload.location,
				}),
				...result.json,
				priority: APPEAL_PRIORITIES[String(result.json.priority || "").toLowerCase()]
					? String(result.json.priority).toLowerCase()
					: fallbackAnalysis({
							description: payload.description,
							location: payload.location,
					  }).priority,
				status: APPEAL_STATUSES[String(result.json.status || "").toLowerCase()]
					? String(result.json.status).toLowerCase()
					: "moderation",
				deadlineDate: /^\d{4}-\d{2}-\d{2}$/.test(deadlineDate)
					? deadlineDate
					: fallbackAnalysis({
							description: payload.description,
							location: payload.location,
					  }).deadlineDate,
				assignedEmployee: chosenEmployee
					? {
							id: chosenEmployee.id,
							name: chosenEmployee.name,
							load: chosenEmployee.load,
					  }
					: null,
				raw: result.raw,
			};
		} catch {
			return {
				...fallbackAnalysis({
					description: payload.description,
					location: payload.location,
				}),
				assignedEmployee: chosenEmployee
					? {
							id: chosenEmployee.id,
							name: chosenEmployee.name,
							load: chosenEmployee.load,
					  }
					: null,
			};
		}
	},
};
