import { PromptModel } from "../models/Prompt.js";
import { AppealModel } from "../models/Appeal.js";
import { UserModel } from "../models/User.js";
import { CategoryModel } from "../models/Category.js";
import { geminiService } from "./geminiService.js";
import {
	APPEAL_PRIORITIES,
	APPEAL_PRIORITY_DEADLINE_DAYS,
} from "../constants/appeal.js";
import { DEFAULT_CATEGORIES, CATEGORY_PLAYBOOK } from "../constants/knowledgeBase.js";

const PROMPT_VERSION = 2;

const VISION_PROMPT_KEYS = ["appeal_create_analysis_vision"];
const CLASSIFICATION_PROMPT_KEYS = [
	"appeal_create_analysis_context",
	"appeal_create_analysis_classification",
	"appeal_create_analysis_playbook",
	"appeal_create_analysis_output",
];
const ANALYSIS_PROMPT_KEYS = [...VISION_PROMPT_KEYS, ...CLASSIFICATION_PROMPT_KEYS];

const DEFAULT_ANALYSIS_PROMPTS = {
	appeal_create_analysis_context: {
		version: PROMPT_VERSION,
		systemPrompt:
			"Ты помощник CityHelp. Отвечай только на русском языке. Анализируй обращение гражданина по фото, описанию, локации и справочнику категорий. Верни только JSON.",
		userTemplate:
			"Описание обращения: {{description}}\nЛокация: {{location}}\nКатегории:\n{{categoryContext}}\n\nСделай осмысленный разбор проблемы. Не копируй текст пользователя дословно. Используй фото-наблюдения, если они переданы.",
		guardrails:
			"Не выдумывай факты. Если данных мало, заполни uncertainties и needsClarification. Все reason-поля должны быть содержательными, а не пустыми.",
	},
	appeal_create_analysis_vision: {
		version: PROMPT_VERSION,
		systemPrompt:
			"Ты анализируешь фотографии городского обращения. Опиши только то, что видно на фото. Верни только JSON на русском языке.",
		userTemplate:
			"Описание пользователя: {{description}}\n\nВерни JSON строго по схеме: {\"photoObservation\":\"...\",\"photoDetails\":[\"...\"],\"photoRelevant\":true,\"photoMismatch\":false,\"uncertainties\":[\"...\"]}. photoDetails должен содержать конкретные видимые детали: объекты, повреждения, следы, окружение, масштаб. Если фото малоинформативное, объясни это в uncertainties.",
		guardrails:
			"Не повторяй комментарий пользователя вместо анализа фото. Не придумывай невидимые объекты. Если видно мало, прямо скажи, чего не хватает.",
		exampleInput: "Фото дороги с повреждением покрытия.",
		exampleOutput:
			"{\"photoObservation\":\"На фото видно повреждённый участок дорожного покрытия с неровностью и лужей рядом.\",\"photoDetails\":[\"повреждение асфальта\",\"неровная поверхность\",\"лужа возле дефекта\",\"участок проезжей части\"],\"photoRelevant\":true,\"photoMismatch\":false,\"uncertainties\":[\"по фото нельзя точно оценить глубину повреждения\"]}",
	},
	appeal_create_analysis_classification: {
		version: PROMPT_VERSION,
		systemPrompt:
			"Ты классифицируешь городское обращение. Выбирай category только из списка категорий, subCategory только из подкатегорий выбранной категории. Верни только JSON на русском языке.",
		userTemplate:
			"Описание: {{description}}\nЛокация: {{location}}\nAI-наблюдение по фото: {{vision}}\nКатегории и playbook:\n{{categoryContext}}\n\nВерни JSON строго по схеме: {\"category\":\"roads|housing|lighting|waste|general\",\"subCategory\":\"...\",\"priority\":\"low|medium|high|urgent\",\"shortSummary\":\"...\",\"analysisSummary\":\"...\",\"evidence\":[\"...\"],\"uncertainties\":[\"...\"],\"assumptions\":[\"...\"],\"needsClarification\":false,\"clarificationReason\":\"...\",\"categoryReason\":\"...\",\"subCategoryReason\":\"...\",\"priorityReason\":\"...\"}.",
		guardrails:
			"Не используй general, если есть подходящая узкая категория. evidence должен содержать факты из фото/описания. uncertainties должен содержать то, что нельзя проверить по данным. shortSummary не должен быть копией описания пользователя.",
		exampleInput: "Описание: На дороге большая яма. Фото: видна выбоина на проезжей части.",
		exampleOutput:
			"{\"category\":\"roads\",\"subCategory\":\"Ямы\",\"priority\":\"urgent\",\"shortSummary\":\"На проезжей части видна опасная выбоина, которая может мешать движению.\",\"analysisSummary\":\"Фото и описание указывают на повреждение дорожного покрытия. Основной риск связан с безопасностью транспорта и пешеходов.\",\"evidence\":[\"на фото виден дефект покрытия\",\"пользователь описывает яму на дороге\"],\"uncertainties\":[\"по фото нельзя точно измерить глубину ямы\"],\"assumptions\":[\"дефект находится на участке движения\"],\"needsClarification\":false,\"clarificationReason\":\"\",\"categoryReason\":\"Проблема относится к дорожному покрытию, а не к двору или мусору.\",\"subCategoryReason\":\"Подкатегория 'Ямы' точнее всего описывает видимый дефект.\",\"priorityReason\":\"Яма на дороге может создавать риск аварии, поэтому приоритет срочный.\"}",
	},
	appeal_create_analysis_playbook: {
		version: PROMPT_VERSION,
		systemPrompt:
			"Ты пользуешься справочником CityHelp, чтобы различать похожие категории. Верни только JSON.",
		userTemplate:
			"Справочник категорий:\n{{categoryContext}}\n\nСравни возможные категории по смыслу обращения и выбери самую точную.",
		guardrails:
			"roads - дорожное покрытие, знаки, разметка. housing - дом, двор, подъезд, коммуникации. lighting - фонари и свет. waste - отходы и санитарное состояние. general - только когда узкая категория не подходит.",
	},
	appeal_create_analysis_output: {
		version: PROMPT_VERSION,
		systemPrompt:
			"Ты собираешь финальный смысловой вывод по обращению. Не выбирай сотрудника, дедлайн, статус и locationCheck: это делает система. Верни только JSON.",
		userTemplate:
			"Проверь, что итог содержит только смысловые AI-поля: category, subCategory, priority, shortSummary, analysisSummary, evidence, uncertainties, assumptions, needsClarification, clarificationReason, categoryReason, subCategoryReason, priorityReason.",
		guardrails:
			"Не оставляй reason-поля пустыми. Не добавляй deadlineAt, status, assignedEmployee и locationCheck.",
	},
};

const getPromptText = (template, payload) => {
	return String(template || "")
		.replaceAll("{{description}}", payload.description || "")
		.replaceAll("{{location}}", JSON.stringify(payload.location || {}))
		.replaceAll("{{photos}}", JSON.stringify(payload.photos || []))
		.replaceAll("{{vision}}", JSON.stringify(payload.vision || {}))
		.replaceAll("{{employees}}", JSON.stringify(payload.employees || []))
		.replaceAll("{{categories}}", JSON.stringify(payload.categories || []))
		.replaceAll("{{categoryContext}}", payload.categoryContext || "")
		.replaceAll("{{appealId}}", payload.appealId || "");
};

const formatDateTimeLocal = (date) => {
	const value = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(value.getTime())) return "";

	const pad = (num) => String(num).padStart(2, "0");
	return [
		value.getFullYear(),
		pad(value.getMonth() + 1),
		pad(value.getDate()),
	].join("-") + ` ${pad(value.getHours())}:${pad(value.getMinutes())}`;
};

const getDeadlineAt = (priority, sourceDate = new Date()) => {
	const days = APPEAL_PRIORITY_DEADLINE_DAYS[priority] || APPEAL_PRIORITY_DEADLINE_DAYS.medium;
	const date = new Date(sourceDate);
	date.setDate(date.getDate() + days);
	return formatDateTimeLocal(date);
};

const formatCategoryContext = (categories = []) => {
	const playbookMap = new Map((CATEGORY_PLAYBOOK || []).map((item) => [item.key, item]));

	return (Array.isArray(categories) ? categories : [])
		.map((category) => {
			const subcategories = Array.isArray(category.subcategories) ? category.subcategories : [];
			const playbook = playbookMap.get(category.key) || {};
			const examples = Array.isArray(playbook.examples) ? playbook.examples : [];

			return [
				`- ${category.key}: ${category.name}`,
				category.description ? `  описание: ${category.description}` : "",
				subcategories.length ? `  подкатегории: ${subcategories.join(", ")}` : "",
				Array.isArray(playbook.signs) && playbook.signs.length ? `  признаки: ${playbook.signs.join("; ")}` : "",
				Array.isArray(playbook.notThisCategory) && playbook.notThisCategory.length ? `  не относится: ${playbook.notThisCategory.join("; ")}` : "",
				Array.isArray(playbook.photoCues) && playbook.photoCues.length ? `  фото-ориентиры: ${playbook.photoCues.join("; ")}` : "",
				examples.length
					? `  примеры:\n${examples
							.slice(0, 2)
							.map((example) => `    вход: ${example.input}\n    выход: ${example.output}`)
							.join("\n")}`
					: "",
			]
				.filter(Boolean)
				.join("\n");
		})
		.filter(Boolean)
		.join("\n\n");
};

const normalizeList = (value, limit = 8) => {
	if (!Array.isArray(value)) return [];

	return value
		.map((item) => String(item || "").trim())
		.filter(Boolean)
		.slice(0, limit);
};

const normalizeBoolean = (value) => {
	if (typeof value === "boolean") return value;
	return String(value || "").toLowerCase() === "true";
};

const hasUsefulText = (value, minLength = 12) => String(value || "").trim().length >= minLength;

const getPrompt = (key, promptMap) => {
	const defaultPrompt = DEFAULT_ANALYSIS_PROMPTS[key] || {};
	const dbPrompt = promptMap.get(key);
	const canUseDbPrompt =
		dbPrompt &&
		Number(dbPrompt.version || 0) >= PROMPT_VERSION &&
		(hasUsefulText(dbPrompt.systemPrompt) || hasUsefulText(dbPrompt.userTemplate));

	return canUseDbPrompt ? { ...defaultPrompt, ...dbPrompt } : defaultPrompt;
};

const buildPromptText = (keys, promptMap, payload) => {
	const prompts = keys.map((key) => getPrompt(key, promptMap)).filter(Boolean);

	return {
		systemInstruction: prompts
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
			.join("\n\n"),
		userPrompt: prompts
			.map((prompt) => getPromptText(prompt.userTemplate, payload))
			.filter(Boolean)
			.join("\n\n"),
	};
};

const fallbackAnalysis = ({ description, location }) => {
	const normalized = String(description || "").toLowerCase();

	let category = "general";
	let subCategory = "Прочее";
	let priority = "medium";

	if (normalized.includes("мусор") || normalized.includes("отход") || normalized.includes("свал")) {
		category = "waste";
		subCategory = "Вывоз мусора";
	}
	if (normalized.includes("яма") || normalized.includes("дорог") || normalized.includes("асфальт")) {
		category = "roads";
		subCategory = "Ямы";
	}
	if (normalized.includes("свет") || normalized.includes("фонар") || normalized.includes("темно")) {
		category = "lighting";
		subCategory = "Улица";
	}
	if (normalized.includes("подъезд") || normalized.includes("отоп") || normalized.includes("вода")) {
		category = "housing";
		subCategory = "Подъезд";
	}
	if (normalized.length > 180) priority = "high";
	if (normalized.includes("авар") || normalized.includes("опас") || normalized.includes("затоп")) priority = "urgent";

	return {
		category,
		subCategory,
		priority,
		status: "moderation",
		deadlineAt: getDeadlineAt(priority),
		locationCheck: Boolean(location?.x && location?.y),
		photoObservation: "",
		photoDetails: [],
		shortSummary: "",
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
		statusReason: "После автоматического анализа обращение отправлено на модерацию для проверки администратором.",
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

const getCategoryMeta = (categories, key) =>
	(Array.isArray(categories) ? categories : []).find((category) => category.key === key) || null;

const normalizeCategory = ({ value, fallback, categories }) => {
	const normalized = String(value || "").trim();
	return getCategoryMeta(categories, normalized) ? normalized : fallback;
};

const normalizeSubCategory = ({ value, category, fallback, categories }) => {
	const meta = getCategoryMeta(categories, category);
	const subcategories = Array.isArray(meta?.subcategories) ? meta.subcategories : [];
	const normalized = String(value || "").trim();
	if (subcategories.includes(normalized)) return normalized;
	if (subcategories.includes(fallback)) return fallback;
	return subcategories[0] || fallback || "";
};

const normalizePriority = (value, fallback = "medium") => {
	const normalized = String(value || "").toLowerCase().trim();
	return APPEAL_PRIORITIES[normalized] ? normalized : fallback;
};

const buildShortSummary = ({ description, photoObservation, shortSummary, category, subCategory }) => {
	const summary = String(shortSummary || "").trim();
	const descriptionText = String(description || "").trim();
	const photoText = String(photoObservation || "").trim();

	if (
		summary.length >= 25 &&
		summary.toLowerCase() !== descriptionText.toLowerCase() &&
		!summary.toLowerCase().includes(descriptionText.toLowerCase())
	) {
		return summary;
	}

	const parts = [];
	if (photoText) parts.push(photoText.replace(/^На фото видно\s*/i, ""));
	if (!photoText && descriptionText) parts.push(descriptionText.slice(0, 120));
	if (category) parts.push(`категория: ${category}`);
	if (subCategory) parts.push(`подкатегория: ${subCategory}`);

	return parts.filter(Boolean).join(". ").replace(/\s+/g, " ").slice(0, 220);
};

const buildAnalysisSummary = (result = {}, chosenEmployee = null) => {
	const parts = [
		String(result.photoObservation || "").trim(),
		normalizeList(result.photoDetails, 4).join(", "),
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

const getDeadlineReason = (priority) => {
	const days = APPEAL_PRIORITY_DEADLINE_DAYS[priority] || APPEAL_PRIORITY_DEADLINE_DAYS.medium;
	const labels = {
		urgent: "срочный",
		high: "высокий",
		medium: "средний",
		low: "низкий",
	};

	return `Для приоритета "${labels[priority] || "средний"}" установлен срок ${days} дн., чтобы обращение было проверено и выполнено в ожидаемые сроки.`;
};

const getLocationReason = (location) => {
	if (location?.x && location?.y) {
		return location.address || location.label
			? `Координаты указаны, адрес распознан как "${location.address || location.label}".`
			: "Координаты указаны, поэтому обращение можно привязать к месту на карте.";
	}

	return "Координаты не указаны или некорректны, поэтому модератору нужно уточнить место.";
};

const runVisionAnalysis = async ({ promptMap, payload }) => {
	const promptPayload = {
		description: payload.description,
		photos: payload.photos,
	};
	const { systemInstruction, userPrompt } = buildPromptText(VISION_PROMPT_KEYS, promptMap, promptPayload);
	const result = await geminiService.generateJson({
		systemInstruction,
		prompt: userPrompt,
		temperature: 0.15,
		images: payload.photos || [],
	});
	const json = result.json || {};

	return {
		raw: result.raw,
		photoObservation: String(json.photoObservation || "").trim(),
		photoDetails: normalizeList(json.photoDetails, 10),
		photoRelevant: json.photoRelevant === undefined ? true : normalizeBoolean(json.photoRelevant),
		photoMismatch: normalizeBoolean(json.photoMismatch),
		uncertainties: normalizeList(json.uncertainties, 6),
	};
};

const runClassificationAnalysis = async ({ promptMap, payload, categories, categoryContext, vision }) => {
	const promptPayload = {
		description: payload.description,
		location: payload.location,
		photos: payload.photos,
		appealId: payload.appealId,
		categories,
		categoryContext,
		vision,
	};
	const { systemInstruction, userPrompt } = buildPromptText(CLASSIFICATION_PROMPT_KEYS, promptMap, promptPayload);
	const result = await geminiService.generateJson({
		systemInstruction,
		prompt: [
			userPrompt,
			"Верни только JSON по указанной схеме. Не добавляй status, deadlineAt, assignedEmployee или locationCheck.",
		].join("\n\n"),
		temperature: 0.2,
		images: payload.photos || [],
	});

	return {
		raw: result.raw,
		json: result.json || {},
	};
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
		const categories = categoryDocs.length ? categoryDocs : DEFAULT_CATEGORIES.map((item) => ({ ...item }));
		const categoryContext = formatCategoryContext(categories);
		const fallback = fallbackAnalysis({
			description: payload.description,
			location: payload.location,
		});

		let vision = {
			raw: "",
			photoObservation: "",
			photoDetails: [],
			photoRelevant: true,
			photoMismatch: false,
			uncertainties: [],
		};
		let classificationRaw = "";
		let classification = {};

		try {
			vision = await runVisionAnalysis({ promptMap, payload });
			const classificationResult = await runClassificationAnalysis({
				promptMap,
				payload,
				categories,
				categoryContext,
				vision,
			});
			classificationRaw = classificationResult.raw;
			classification = classificationResult.json;
		} catch (error) {
			classification = {
				aiError: String(error?.statusMessage || error?.message || "AI analysis failed"),
			};
		}

		const category = normalizeCategory({
			value: classification.category,
			fallback: fallback.category,
			categories,
		});
		const subCategory = normalizeSubCategory({
			value: classification.subCategory,
			category,
			fallback: fallback.subCategory,
			categories,
		});
		const priority = normalizePriority(classification.priority, fallback.priority);
		const deadlineAt = getDeadlineAt(priority);
		const locationCheck = Boolean(payload.location?.x && payload.location?.y);
		const assignedEmployee = chosenEmployee
			? {
					id: chosenEmployee.id,
					name: chosenEmployee.name,
					load: chosenEmployee.load,
			  }
			: null;

		const photoObservation = vision.photoObservation || String(classification.photoObservation || "").trim();
		const photoDetails = vision.photoDetails.length
			? vision.photoDetails
			: normalizeList(classification.photoDetails, 10);
		const evidence = normalizeList(classification.evidence, 8);
		const uncertainties = [
			...vision.uncertainties,
			...normalizeList(classification.uncertainties, 8),
		].slice(0, 10);

		const result = {
			...fallback,
			...classification,
			category,
			subCategory,
			priority,
			status: "moderation",
			deadlineAt,
			deadlineReason: getDeadlineReason(priority),
			assignedEmployee,
			assignedEmployeeReason: assignedEmployee
				? `Выбран сотрудник ${assignedEmployee.name} с текущей нагрузкой ${assignedEmployee.load}.`
				: "Активный сотрудник для назначения не найден.",
			locationCheck,
			locationReason: getLocationReason(payload.location),
			photoObservation,
			photoDetails,
			photoRelevant: vision.photoRelevant,
			photoMismatch: vision.photoMismatch,
			shortSummary: buildShortSummary({
				description: payload.description,
				photoObservation,
				shortSummary: classification.shortSummary,
				category,
				subCategory,
			}),
			evidence: evidence.length ? evidence : photoDetails.slice(0, 6),
			uncertainties,
			assumptions: normalizeList(classification.assumptions, 8),
			needsClarification: normalizeBoolean(classification.needsClarification) || !locationCheck || vision.photoMismatch,
			clarificationReason: String(classification.clarificationReason || "").trim(),
			categoryReason:
				String(classification.categoryReason || "").trim() ||
				`Категория "${category}" выбрана по совпадению описания, фото-наблюдений и справочника CityHelp.`,
			subCategoryReason:
				String(classification.subCategoryReason || "").trim() ||
				(subCategory ? `Подкатегория "${subCategory}" точнее всего описывает выявленный тип проблемы.` : ""),
			priorityReason:
				String(classification.priorityReason || "").trim() ||
				`Приоритет "${priority}" выбран по характеру проблемы и потенциальному влиянию на жителей.`,
			statusReason: "После автоматического анализа обращение отправлено на модерацию для проверки администратором.",
			raw: {
				vision: vision.raw,
				classification: classificationRaw,
			},
		};

		return {
			...result,
			analysisSummary:
				String(classification.analysisSummary || "").trim() ||
				buildAnalysisSummary(result, chosenEmployee),
		};
	},
};
