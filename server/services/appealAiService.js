import { PromptModel } from "../models/Prompt.js";
import { AppealModel } from "../models/Appeal.js";
import { UserModel } from "../models/User.js";
import { CategoryModel } from "../models/Category.js";
import { geminiService } from "./geminiService.js";
import {
	APPEAL_STATUSES,
	APPEAL_PRIORITIES,
	APPEAL_PRIORITY_DEADLINE_DAYS,
} from "../constants/appeal.js";
import { DEFAULT_CATEGORIES } from "../constants/knowledgeBase.js";

const ANALYSIS_PROMPT_KEYS = [
	"appeal_create_analysis_context",
	"appeal_create_analysis_vision",
	"appeal_create_analysis_classification",
	"appeal_create_analysis_deadline",
	"appeal_create_analysis_assignment",
	"appeal_create_analysis_output",
];

const DEFAULT_ANALYSIS_PROMPTS = {
	appeal_create_analysis_context: {
		systemPrompt:
			"Ты помощник CityHelp. Отвечай только на русском языке. Твоя задача - подробно и аккуратно анализировать обращение гражданина. Возвращай только JSON без лишнего текста.",
		userTemplate:
			"Описание обращения: {{description}}\nЛокация: {{location}}\nФото: {{photos}}\nКатегории: {{categories}}\n\nОпредели, что именно происходит, к какой городской теме это относится, насколько это срочно и что нужно передать модератору.",
		guardrails:
			"Не выдумывай факты. Если не хватает данных, needsClarification=true. Пиши не только итог, но и краткое пояснение, на что ты опирался. Краткие текстовые поля пиши на русском языке. Статус обращения после AI всегда moderation.",
	},
	appeal_create_analysis_vision: {
		systemPrompt:
			"Ты анализируешь фотографии обращения. Опиши только то, что видно на фото, без домыслов. Отвечай только на русском языке и возвращай только JSON.",
		userTemplate:
			"Посмотри на фото обращения. Верни JSON с полями: photoObservation, photoDetails, photoRelevant, photoMismatch. photoObservation должен быть конкретным и коротким, photoDetails - массивом наблюдаемых объектов и признаков.",
		guardrails:
			"Если фото не связаны с обращением, укажи это в photoMismatch. Не придумывай объекты, которых не видно. Отдельно укажи, какие детали на фото стали основой вывода.",
	},
	appeal_create_analysis_classification: {
		systemPrompt:
			"Ты классифицируешь обращение и объясняешь выбор категории, подкатегории и приоритета. Отвечай по-русски и только JSON.",
		userTemplate:
			"На основе описания и фото определи category, subCategory, priority и shortSummary. shortSummary должен быть 1-2 предложениями и конкретно описывать проблему.",
		guardrails:
			"Категория и приоритет должны быть реалистичными и соответствовать смыслу обращения. Не используй общие фразы вроде 'требует внимания'. Объясняй, почему именно этот класс проблемы выбран.",
	},
	appeal_create_analysis_deadline: {
		systemPrompt:
			"Ты рассчитываешь срок решения обращения. Отвечай только на русском языке и возвращай только JSON.",
		userTemplate:
			"На основе описания, фото, категории и приоритета определи дедлайн не в часах, а датой. Верни JSON с полями: deadlineDate, deadlineReason.",
		guardrails:
			"deadlineDate должен быть строкой в формате YYYY-MM-DD. Не возвращай часы. Срок должен быть реалистичным и понятным. Объясни, почему такой срок выбран.",
	},
	appeal_create_analysis_assignment: {
		systemPrompt:
			"Ты подбираешь сотрудника с наименьшей нагрузкой. Отвечай по-русски и возвращай только JSON.",
		userTemplate:
			"Тебе переданы сотрудники и их нагрузка. Выбери одного сотрудника и объясни выбор. Верни поля: assignedEmployee, assignedEmployeeReason.",
		guardrails:
			"Нельзя возвращать список сотрудников. Нужно выбрать только одного сотрудника и объяснить выбор просто и понятно. Отдельно укажи, что сыграло решающую роль - нагрузка, специализация или статус обращения.",
	},
	appeal_create_analysis_output: {
		systemPrompt:
			"Ты собираешь финальный ответ для системы CityHelp. Верни только JSON и ничего кроме JSON.",
		userTemplate:
			"Итоговый JSON должен содержать поля: category, subCategory, priority, status, deadlineDate, assignedEmployee, locationCheck, photoObservation, photoDetails, shortSummary, analysisSummary, evidence, uncertainties, assumptions, needsClarification, clarificationReason, categoryReason, subCategoryReason, priorityReason, deadlineReason, statusReason, assignedEmployeeReason, locationReason.",
		guardrails:
			"shortSummary должен быть коротким, но не повторять текст обращения дословно. Он должен объединять фото, описание и вывод. Без лишних слов и без английского текста. Статус обращения после AI всегда moderation. Все причины должны быть на русском языке и объяснять логику решения. Добавь analysisSummary, evidence и uncertainties, если видишь их.",
	},
};

const getPromptText = (template, payload) => {
	return String(template || "")
		.replaceAll("{{description}}", payload.description || "")
		.replaceAll("{{location}}", JSON.stringify(payload.location || {}))
		.replaceAll("{{photos}}", JSON.stringify(payload.photos || []))
		.replaceAll("{{employees}}", JSON.stringify(payload.employees || []))
		.replaceAll("{{categories}}", JSON.stringify(payload.categories || []))
		.replaceAll("{{appealId}}", payload.appealId || "");
};

const getDeadlineDate = (days) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date.toISOString().slice(0, 10);
};

const fallbackAnalysis = ({ description, location }) => {
	const normalized = String(description || "").toLowerCase();

	let category = "general";
	let subCategory = "";
	let priority = "medium";
	if (normalized.includes("мусор") || normalized.includes("отход")) {
		category = "waste";
		subCategory = "Вывоз мусора";
	}
	if (normalized.includes("яма") || normalized.includes("дорог")) {
		category = "roads";
		subCategory = "Дорожное покрытие";
	}
	if (normalized.includes("свет") || normalized.includes("фонар")) {
		category = "lighting";
		subCategory = "Освещение";
	}
	if (normalized.length > 180) priority = "high";
	if (normalized.includes("авар") || normalized.includes("опас")) priority = "urgent";

	const deadlineDays = APPEAL_PRIORITY_DEADLINE_DAYS[priority] || APPEAL_PRIORITY_DEADLINE_DAYS.medium;

	return {
		category,
		subCategory,
		priority,
		status: "moderation",
		deadlineDate: getDeadlineDate(deadlineDays),
		locationCheck: Boolean(location?.x && location?.y),
		photoObservation: "",
		photoDetails: [],
		shortSummary: description?.slice(0, 160) || "",
		analysisSummary: "",
		evidence: [],
		uncertainties: [],
		assumptions: [],
		needsClarification: false,
		clarificationReason: "",
		categoryReason: "",
		subCategoryReason: "",
		priorityReason: "",
		deadlineReason: "",
		statusReason: "",
		assignedEmployeeReason: "",
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

const normalizeList = (value) => {
	if (!Array.isArray(value)) return [];

	return value
		.map((item) => String(item || "").trim())
		.filter(Boolean)
		.slice(0, 8);
};

const buildShortSummary = ({ description, photoObservation, shortSummary, category, subCategory }) => {
	const normalizedShortSummary = String(shortSummary || "").trim();
	const normalizedDescription = String(description || "").trim();
	const normalizedPhotoObservation = String(photoObservation || "").trim();
	const normalizedCategory = String(category || "").trim();
	const normalizedSubCategory = String(subCategory || "").trim();

	if (
		normalizedShortSummary &&
		normalizedShortSummary.length >= 25 &&
		normalizedShortSummary !== normalizedDescription &&
		normalizedShortSummary.toLowerCase() !== normalizedDescription.toLowerCase()
	) {
		return normalizedShortSummary;
	}

	const parts = [];

	if (normalizedPhotoObservation) {
		parts.push(normalizedPhotoObservation.replace(/^На фото видно\s*/i, ""));
	}

	if (normalizedDescription) {
		parts.push(normalizedDescription.slice(0, 110));
	}

	if (category) {
		parts.push(`категория: ${normalizedCategory}`);
	}

	if (normalizedSubCategory) {
		parts.push(`подкатегория: ${normalizedSubCategory}`);
	}

	return parts
		.filter(Boolean)
		.join(". ")
		.replace(/\s+/g, " ")
		.slice(0, 220);
};

const buildAnalysisSummary = (result = {}, chosenEmployee = null) => {
	const parts = [
		String(result.categoryReason || "").trim(),
		String(result.priorityReason || "").trim(),
		String(result.deadlineReason || "").trim(),
		String(result.locationReason || "").trim(),
		String(result.statusReason || "").trim(),
		String(result.assignedEmployeeReason || "").trim(),
	];

	if (!parts.some(Boolean) && chosenEmployee) {
		parts.push(`Выбран сотрудник ${chosenEmployee.name} с текущей нагрузкой ${chosenEmployee.load}.`);
	}

	return parts.filter(Boolean).join(" ");
};

export const appealAiService = {
	async analyzeAppeal(payload = {}) {
		const promptDocs = await PromptModel.find({
			key: { $in: ANALYSIS_PROMPT_KEYS },
			isActive: true,
		}).lean();
		const categoryDocs = await CategoryModel.find({ isActive: true }).sort({ order: 1 }).lean();

		const promptMap = new Map(promptDocs.map((prompt) => [prompt.key, prompt]));

		const chosenEmployee = await pickLeastBusyEmployee();
		const categories = categoryDocs.length
			? categoryDocs
			: DEFAULT_CATEGORIES.map((item) => ({ ...item }));
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
						appealId: payload.appealId,
						employees: chosenEmployee ? [chosenEmployee] : [],
						categories,
					}),
				),
				`Дополнительные данные:\n${JSON.stringify(
						{
							description: payload.description,
							location: payload.location,
							photoCount: Array.isArray(payload.photos) ? payload.photos.length : 0,
							employeeLoadHint: chosenEmployee ? chosenEmployee.load : null,
							assignedEmployeeHint: chosenEmployee || null,
							appealId: payload.appealId || null,
							categories,
						},
						null,
						2,
				)}`,
				"Верни итоговый JSON на русском языке. shortSummary должен описывать то, что видно на фото и что указано в описании, но не повторять текст дословно. deadlineDate укажи в формате YYYY-MM-DD. statusReason должен объяснять, почему обращение ушло в модерацию. assignedEmployeeReason должен объяснять, почему выбран именно этот сотрудник. Если возможно, заполни subCategory и subCategoryReason. В evidence дай конкретные факты, а в uncertainties - что осталось неясным.",
			]
				.filter(Boolean)
				.join("\n\n");

			const result = await geminiService.generateJson({
				systemInstruction,
				prompt: userPrompt,
				temperature: 0.2,
				images: payload.photos || [],
			});

			const json = result.json || {};
			const deadlineDate = String(json.deadlineDate || "").trim();
			const fallback = fallbackAnalysis({
				description: payload.description,
				location: payload.location,
			});
			const summary = buildShortSummary({
				description: payload.description,
				photoObservation: json.photoObservation || fallback.photoObservation,
				shortSummary: json.shortSummary || fallback.shortSummary,
				category: String(json.category || fallback.category),
				subCategory: String(json.subCategory || fallback.subCategory || ""),
			});

			return {
				...fallback,
				...json,
				subCategory: String(json.subCategory || fallback.subCategory || "").trim(),
				priority: APPEAL_PRIORITIES[String(json.priority || "").toLowerCase()]
					? String(json.priority).toLowerCase()
					: fallback.priority,
				status: APPEAL_STATUSES[String(json.status || "").toLowerCase()]
					? String(json.status).toLowerCase()
					: "moderation",
				deadlineDate: /^\d{4}-\d{2}-\d{2}$/.test(deadlineDate)
					? deadlineDate
					: fallback.deadlineDate,
				assignedEmployee: chosenEmployee
					? {
							id: chosenEmployee.id,
							name: chosenEmployee.name,
							load: chosenEmployee.load,
					  }
					: null,
				shortSummary: summary,
				analysisSummary:
					String(json.analysisSummary || "").trim() ||
					buildAnalysisSummary(json, chosenEmployee),
				evidence:
					normalizeList(json.evidence).length
						? normalizeList(json.evidence)
						: normalizeList(json.photoDetails).slice(0, 6),
				uncertainties: normalizeList(json.uncertainties),
				assumptions: normalizeList(json.assumptions),
				assignedEmployeeReason:
					String(json.assignedEmployeeReason || "").trim() ||
					(chosenEmployee
						? `У сотрудника сейчас меньше открытых обращений: ${chosenEmployee.load}`
						: ""),
				subCategoryReason: String(json.subCategoryReason || "").trim(),
				statusReason:
					String(json.statusReason || "").trim() ||
					"После автоматического анализа обращение отправлено на модерацию для проверки администратором.",
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
				shortSummary: buildShortSummary({
					description: payload.description,
					photoObservation: "",
					shortSummary: "",
					category: "",
					subCategory: "",
				}),
				subCategory: "",
				analysisSummary: buildAnalysisSummary({}, chosenEmployee),
				evidence: [],
				uncertainties: [],
				assumptions: [],
				assignedEmployeeReason: chosenEmployee
					? `У сотрудника сейчас меньше открытых обращений: ${chosenEmployee.load}`
					: "",
				subCategoryReason: "",
				statusReason:
					"После автоматического анализа обращение отправлено на модерацию для проверки администратором.",
			};
		}
	},
};
