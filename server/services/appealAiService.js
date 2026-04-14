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

const PROMPT_VERSION = 4;
const ANALYSIS_PIPELINE_VERSION = "cityhelp-ai-v2.2";
const CONFIDENCE_THRESHOLDS = {
	high: 0.8,
	medium: 0.5,
};
const CATEGORY_CANDIDATE_LIMIT = 4;
const CIVIC_REPORT_KEYWORDS = [
	"мусор",
	"свал",
	"контейнер",
	"яма",
	"дорог",
	"асфальт",
	"фонар",
	"свет",
	"подъезд",
	"вода",
	"отоп",
	"теч",
	"двор",
	"уборк",
	"отход",
	"люк",
	"знак",
];

const VALIDITY_PROMPT_KEYS = ["appeal_create_analysis_validity"];
const VISION_PROMPT_KEYS = ["appeal_create_analysis_vision"];
const CLASSIFICATION_PROMPT_KEYS = [
	"appeal_create_analysis_context",
	"appeal_create_analysis_classification",
	"appeal_create_analysis_playbook",
	"appeal_create_analysis_output",
];
const ANALYSIS_PROMPT_KEYS = [
	...VALIDITY_PROMPT_KEYS,
	...VISION_PROMPT_KEYS,
	...CLASSIFICATION_PROMPT_KEYS,
];

const DEFAULT_ANALYSIS_PROMPTS = {
	appeal_create_analysis_validity: {
		version: PROMPT_VERSION,
		systemPrompt:
			"Ты проверяешь, является ли обращение гражданина реальной городской проблемой. Отвечай только на русском языке и только JSON. Если на фото нет признаков городской проблемы, а изображён человек, селфи, шутка, мем, случайная сцена или несвязанный объект, не классифицируй это как нормальное обращение.",
		userTemplate:
			"Проверь обращение на валидность.\nОписание: {{description}}\nЛокация: {{location}}\nФото: {{photos}}\n\nВерни JSON строго по схеме: {\"isValidAppeal\":true,\"validityReason\":\"...\",\"abuseScore\":0.0,\"relevanceScore\":0.0,\"containsHumanPortrait\":false,\"containsCityProblem\":true,\"textPhotoConsistency\":0.0,\"rejectionRecommendation\":\"...\",\"rejectionReason\":\"...\",\"uncertainties\":[\"...\"]}. abuseScore, relevanceScore и textPhotoConsistency - числа от 0 до 1.",
		guardrails:
			"Не выдумывай проблему, если на фото её нет. Если изображён человек крупным планом и нет городской неисправности, это сильный сигнал нерелевантного обращения. Если текст и фото противоречат друг другу, укажи это. Если данных мало, не отклоняй автоматически, а отправляй на ручную проверку через uncertainties.",
		exampleInput: "Описание: Во дворе мусор. На фото крупным планом лицо человека без признаков городской проблемы.",
		exampleOutput:
			"{\"isValidAppeal\":false,\"validityReason\":\"На фото не видно мусора или другой городской проблемы, в кадре в основном человек крупным планом.\",\"abuseScore\":0.94,\"relevanceScore\":0.11,\"containsHumanPortrait\":true,\"containsCityProblem\":false,\"textPhotoConsistency\":0.08,\"rejectionRecommendation\":\"likely_fake_or_irrelevant\",\"rejectionReason\":\"Фото не подтверждает заявленную проблему и похоже на нерелевантное обращение.\",\"uncertainties\":[]}",
	},
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
			"Описание пользователя: {{description}}\n\nВерни JSON строго по схеме: {\"photoObservation\":\"...\",\"photoDetails\":[\"...\"],\"photoRelevant\":true,\"photoMismatch\":false,\"confidencePhoto\":0.0,\"containsPerson\":false,\"isSelfie\":false,\"sceneType\":\"...\",\"textPhotoConflictReason\":\"...\",\"fraudSignals\":[\"...\"],\"uncertainties\":[\"...\"]}. confidencePhoto - число от 0 до 1, где 1 означает, что фото хорошо подтверждает проблему. photoDetails должен содержать конкретные видимые детали: объекты, повреждения, следы, окружение, масштаб. Если фото малоинформативное, объясни это в uncertainties.",
		guardrails:
			"Не повторяй комментарий пользователя вместо анализа фото. Не придумывай невидимые объекты. Если видно мало, прямо скажи, чего не хватает. Если фото похоже на селфи, личное фото или не показывает городскую проблему, отметь это в isSelfie, photoMismatch, textPhotoConflictReason и fraudSignals.",
		exampleInput: "Фото дороги с повреждением покрытия.",
		exampleOutput:
			"{\"photoObservation\":\"На фото видно повреждённый участок дорожного покрытия с неровностью и лужей рядом.\",\"photoDetails\":[\"повреждение асфальта\",\"неровная поверхность\",\"лужа возле дефекта\",\"участок проезжей части\"],\"photoRelevant\":true,\"photoMismatch\":false,\"confidencePhoto\":0.84,\"containsPerson\":false,\"isSelfie\":false,\"sceneType\":\"городская проблема\",\"textPhotoConflictReason\":\"\",\"fraudSignals\":[],\"uncertainties\":[\"по фото нельзя точно оценить глубину повреждения\"]}",
	},
	appeal_create_analysis_classification: {
		version: PROMPT_VERSION,
		systemPrompt:
			"Ты классифицируешь городское обращение. Выбирай category только из shortlist категорий, subCategory только из подкатегорий выбранной категории. Верни только JSON на русском языке.",
		userTemplate:
			"Описание: {{description}}\nЛокация: {{location}}\nAI-наблюдение по фото: {{vision}}\nShortlist категорий:\n{{categoryContext}}\n\nВерни JSON строго по схеме: {\"category\":\"...\",\"subCategory\":\"...\",\"priority\":\"low|medium|high|urgent\",\"confidenceCategory\":0.0,\"confidencePriority\":0.0,\"shortSummary\":\"...\",\"analysisSummary\":\"...\",\"userSummary\":\"...\",\"moderatorSummary\":\"...\",\"employeeSummary\":\"...\",\"evidence\":[\"...\"],\"uncertainties\":[\"...\"],\"assumptions\":[\"...\"],\"needsClarification\":false,\"clarificationReason\":\"...\",\"categoryReason\":\"...\",\"subCategoryReason\":\"...\",\"priorityReason\":\"...\"}. confidenceCategory и confidencePriority - числа от 0 до 1.",
		guardrails:
			"Не используй general, если есть подходящая узкая категория из shortlist. evidence должен содержать факты из фото/описания. uncertainties должен содержать то, что нельзя проверить по данным. shortSummary не должен быть копией описания пользователя. Если confidence ниже 0.5, обязательно needsClarification=true и объясни почему.",
		exampleInput: "Описание: На дороге большая яма. Фото: видна выбоина на проезжей части.",
		exampleOutput:
			"{\"category\":\"roads\",\"subCategory\":\"Ямы\",\"priority\":\"urgent\",\"confidenceCategory\":0.91,\"confidencePriority\":0.82,\"shortSummary\":\"На проезжей части видна опасная выбоина, которая может мешать движению.\",\"analysisSummary\":\"Фото и описание указывают на повреждение дорожного покрытия. Основной риск связан с безопасностью транспорта и пешеходов.\",\"userSummary\":\"Обращение похоже на проблему с дорожным покрытием и будет проверено модератором.\",\"moderatorSummary\":\"Категория roads выбрана по видимому дефекту покрытия и описанию ямы.\",\"employeeSummary\":\"Проверить участок дороги, оценить размер выбоины и необходимость ремонта покрытия.\",\"evidence\":[\"на фото виден дефект покрытия\",\"пользователь описывает яму на дороге\"],\"uncertainties\":[\"по фото нельзя точно измерить глубину ямы\"],\"assumptions\":[\"дефект находится на участке движения\"],\"needsClarification\":false,\"clarificationReason\":\"\",\"categoryReason\":\"Проблема относится к дорожному покрытию, а не к двору или мусору.\",\"subCategoryReason\":\"Подкатегория 'Ямы' точнее всего описывает видимый дефект.\",\"priorityReason\":\"Яма на дороге может создавать риск аварии, поэтому приоритет срочный.\"}",
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

const clampConfidence = (value, fallback = 0.5) => {
	const number = Number(value);
	if (!Number.isFinite(number)) return fallback;
	const normalized = number > 1 && number <= 100 ? number / 100 : number;
	return Math.min(1, Math.max(0, normalized));
};

const getConfidenceLevel = (...values) => {
	const normalizedValues = values.map((value) => clampConfidence(value)).filter(Number.isFinite);
	const confidence = normalizedValues.length ? Math.min(...normalizedValues) : 0.5;
	if (confidence >= CONFIDENCE_THRESHOLDS.high) return "high";
	if (confidence >= CONFIDENCE_THRESHOLDS.medium) return "medium";
	return "low";
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

const getSearchText = ({ description = "", location = {}, vision = {} }) =>
	[
		description,
		location?.address,
		location?.label,
		vision?.photoObservation,
		...(Array.isArray(vision?.photoDetails) ? vision.photoDetails : []),
	]
		.map((item) => String(item || "").toLowerCase())
		.filter(Boolean)
		.join(" ");

const splitSignalWords = (value) =>
	String(value || "")
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, " ")
		.split(/\s+/)
		.map((item) => item.trim())
		.filter((item) => item.length >= 4);

const getCategorySignals = (category) => {
	const playbook = (CATEGORY_PLAYBOOK || []).find((item) => item.key === category.key) || {};
	const examples = Array.isArray(playbook.examples) ? playbook.examples : [];

	return [
		category.key,
		category.name,
		category.description,
		...(Array.isArray(category.subcategories) ? category.subcategories : []),
		...(Array.isArray(playbook.signs) ? playbook.signs : []),
		...(Array.isArray(playbook.photoCues) ? playbook.photoCues : []),
		...examples.flatMap((example) => [example.input, example.output]),
	];
};

const scoreCategoryCandidate = ({ category, searchText, fallbackCategory }) => {
	const signals = getCategorySignals(category);
	let score = category.key === fallbackCategory ? 3 : 0;
	const reasons = [];

	for (const signal of signals) {
		const normalizedSignal = String(signal || "").toLowerCase().trim();
		if (!normalizedSignal) continue;

		if (normalizedSignal.length >= 6 && searchText.includes(normalizedSignal)) {
			score += 3;
			reasons.push(`совпадение фразы "${normalizedSignal.slice(0, 60)}"`);
			continue;
		}

		const matchedWords = splitSignalWords(normalizedSignal).filter((word) => searchText.includes(word));
		if (matchedWords.length) {
			score += Math.min(2.4, matchedWords.length * 0.6);
			reasons.push(`ключевые слова: ${matchedWords.slice(0, 4).join(", ")}`);
		}
	}

	if (category.key === "general") {
		score -= 1.5;
	}

	return {
		category,
		score: Math.max(0, Number(score.toFixed(2))),
		reasons: Array.from(new Set(reasons)).slice(0, 4),
	};
};

const getTopCategoryCandidates = ({ description, location, vision, categories, fallbackCategory, topK = CATEGORY_CANDIDATE_LIMIT }) => {
	const searchText = getSearchText({ description, location, vision });
	const scored = (Array.isArray(categories) ? categories : [])
		.map((category) => scoreCategoryCandidate({ category, searchText, fallbackCategory }))
		.sort((a, b) => b.score - a.score || Number(a.category.order || 0) - Number(b.category.order || 0));

	const selected = scored
		.filter((item) => item.score > 0 || item.category.key === fallbackCategory)
		.slice(0, topK);

	if (!selected.some((item) => item.category.key === fallbackCategory)) {
		const fallback = scored.find((item) => item.category.key === fallbackCategory);
		if (fallback) selected.unshift(fallback);
	}

	if (!selected.length) {
		selected.push(...scored.slice(0, topK));
	}

	const unique = [];
	const keys = new Set();
	for (const item of selected) {
		if (keys.has(item.category.key)) continue;
		keys.add(item.category.key);
		unique.push(item);
	}

	if (!keys.has("general")) {
		const general = scored.find((item) => item.category.key === "general");
		if (general && unique.length < topK + 1) unique.push(general);
	}

	return unique.map((item) => ({
		...item.category,
		candidateScore: item.score,
		candidateReasons: item.reasons,
	}));
};

const descriptionLooksLikeCityReport = (description = "") => {
	const normalized = String(description || "").toLowerCase();
	return CIVIC_REPORT_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const detectManualReviewSignals = ({ description = "", vision = {} }) => {
	const moderationFlags = [];
	const fraudSignals = normalizeList(vision.fraudSignals, 6);
	const textPhotoConflictReason = String(vision.textPhotoConflictReason || "").trim();
	const looksLikeCityReport = descriptionLooksLikeCityReport(description);
	const selfieConflict = Boolean(vision.isSelfie) && looksLikeCityReport;
	const personConflict = Boolean(vision.containsPerson) && !vision.photoRelevant && looksLikeCityReport;
	const explicitMismatch = Boolean(vision.photoMismatch);

	if (explicitMismatch) moderationFlags.push("photo_mismatch");
	if (selfieConflict) moderationFlags.push("possible_selfie_instead_of_issue");
	if (personConflict) moderationFlags.push("photo_shows_person_not_issue");
	if (fraudSignals.length) moderationFlags.push("fraud_signals_detected");

	return {
		forcedManualReview: explicitMismatch || selfieConflict || personConflict || fraudSignals.length > 0,
		moderationFlags: Array.from(new Set(moderationFlags)),
		fraudSignals,
		textPhotoConflictReason,
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
		moderationFlags: [],
		fraudSignals: [],
		textPhotoConflictReason: "",
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

const runValidityAnalysis = async ({ promptMap, payload }) => {
	const promptPayload = {
		description: payload.description,
		location: payload.location,
		photos: payload.photos,
	};
	const { systemInstruction, userPrompt } = buildPromptText(
		VALIDITY_PROMPT_KEYS,
		promptMap,
		promptPayload,
	);
	const result = await geminiService.generateJson({
		systemInstruction,
		prompt: userPrompt,
		temperature: 0.1,
		images: payload.photos || [],
	});
	const json = result.json || {};

	return {
		raw: result.raw,
		isValidAppeal: json.isValidAppeal === undefined ? true : normalizeBoolean(json.isValidAppeal),
		validityReason: String(json.validityReason || "").trim(),
		abuseScore: clampConfidence(json.abuseScore, 0.15),
		relevanceScore: clampConfidence(json.relevanceScore, 0.7),
		containsHumanPortrait: normalizeBoolean(json.containsHumanPortrait),
		containsCityProblem: json.containsCityProblem === undefined ? true : normalizeBoolean(json.containsCityProblem),
		textPhotoConsistency: clampConfidence(json.textPhotoConsistency, 0.7),
		rejectionRecommendation: String(json.rejectionRecommendation || "").trim(),
		rejectionReason: String(json.rejectionReason || "").trim(),
		uncertainties: normalizeList(json.uncertainties, 6),
	};
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
		confidencePhoto: clampConfidence(json.confidencePhoto, 0.5),
		containsPerson: normalizeBoolean(json.containsPerson),
		isSelfie: normalizeBoolean(json.isSelfie),
		sceneType: String(json.sceneType || "").trim(),
		textPhotoConflictReason: String(json.textPhotoConflictReason || "").trim(),
		fraudSignals: normalizeList(json.fraudSignals, 6),
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
			`Доступные category строго ограничены этим shortlist: ${categories.map((category) => category.key).join(", ")}.`,
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
		const fallback = fallbackAnalysis({
			description: payload.description,
			location: payload.location,
		});
		let validity = {
			raw: "",
			isValidAppeal: true,
			validityReason: "",
			abuseScore: 0.15,
			relevanceScore: 0.7,
			containsHumanPortrait: false,
			containsCityProblem: true,
			textPhotoConsistency: 0.7,
			rejectionRecommendation: "",
			rejectionReason: "",
			uncertainties: [],
		};

		let vision = {
			raw: "",
			photoObservation: "",
			photoDetails: [],
			photoRelevant: true,
			photoMismatch: false,
			confidencePhoto: 0.5,
			containsPerson: false,
			isSelfie: false,
			sceneType: "",
			textPhotoConflictReason: "",
			fraudSignals: [],
			uncertainties: [],
		};
		let classificationRaw = "";
		let classification = {};
		let candidateCategories = [];

		try {
			validity = await runValidityAnalysis({ promptMap, payload });
			if (!validity.isValidAppeal) {
				const priority = "low";
				const deadlineAt = getDeadlineAt(priority);
				const validityReason =
					validity.validityReason ||
					"Обращение выглядит нерелевантным и требует проверки модератором.";
				const rejectionReason =
					validity.rejectionReason ||
					"Фото или описание не подтверждают наличие городской проблемы.";

				return {
					...fallback,
					analysisPipelineVersion: ANALYSIS_PIPELINE_VERSION,
					promptVersion: PROMPT_VERSION,
					category: "general",
					subCategory: "Уточнение",
					priority,
					status: "moderation",
					deadlineAt,
					deadlineReason: getDeadlineReason(priority),
					assignedEmployee: null,
					assignedEmployeeReason:
						"Сотрудник не назначен автоматически, потому что обращение требует ручной проверки модератором.",
					locationCheck: Boolean(payload.location?.x && payload.location?.y),
					locationReason: getLocationReason(payload.location),
					photoObservation: validityReason,
					photoDetails: [],
					photoRelevant: false,
					photoMismatch: true,
					containsPerson: validity.containsHumanPortrait,
					isSelfie: validity.containsHumanPortrait && !validity.containsCityProblem,
					sceneType: validity.containsHumanPortrait ? "нерелевантное фото" : "требует проверки",
					textPhotoConflictReason: rejectionReason,
					fraudSignals: Array.from(
						new Set(
							[
								validity.rejectionRecommendation,
								!validity.containsCityProblem ? "no_city_problem_detected" : "",
								validity.containsHumanPortrait ? "human_portrait_detected" : "",
								validity.textPhotoConsistency < 0.4 ? "text_photo_mismatch" : "",
							].filter(Boolean),
						),
					),
					moderationFlags: [
						"invalid_appeal_detected",
						!validity.containsCityProblem ? "no_city_problem_detected" : "",
						validity.containsHumanPortrait ? "photo_shows_person_not_issue" : "",
						validity.textPhotoConsistency < 0.4 ? "photo_mismatch" : "",
					].filter(Boolean),
					confidenceCategory: 0.22,
					confidencePriority: 0.3,
					confidencePhoto: Math.min(0.25, validity.relevanceScore),
					confidenceLevel: "low",
					needsCarefulReview: true,
					isValidAppeal: false,
					validityReason,
					abuseScore: validity.abuseScore,
					relevanceScore: validity.relevanceScore,
					containsHumanPortrait: validity.containsHumanPortrait,
					containsCityProblem: validity.containsCityProblem,
					textPhotoConsistency: validity.textPhotoConsistency,
					rejectionRecommendation:
						validity.rejectionRecommendation || "likely_fake_or_irrelevant",
					rejectionReason,
					shortSummary:
						"AI считает обращение нерелевантным или недостаточно связанным с городской проблемой.",
					analysisSummary: `${validityReason} ${rejectionReason}`.trim(),
					evidence: [validityReason, rejectionReason].filter(Boolean),
					uncertainties: validity.uncertainties,
					assumptions: [],
					needsClarification: false,
					clarificationReason: "",
					categoryReason:
						"Категория general выбрана временно, потому что обращение не подтверждено как реальная городская проблема.",
					subCategoryReason:
						"Подкатегория 'Уточнение' используется до решения модератора.",
					priorityReason:
						"Для спорного или нерелевантного обращения установлен низкий приоритет до проверки модератором.",
					statusReason:
						"Обращение отправлено на модерацию, потому что AI рекомендует ручную проверку перед дальнейшей обработкой.",
					raw: {
						validity: validity.raw,
						vision: "",
						classification: "",
					},
				};
			}

			vision = await runVisionAnalysis({ promptMap, payload });
			candidateCategories = getTopCategoryCandidates({
				description: payload.description,
				location: payload.location,
				vision,
				categories,
				fallbackCategory: fallback.category,
			});
			const classificationResult = await runClassificationAnalysis({
				promptMap,
				payload,
				categories: candidateCategories,
				categoryContext: formatCategoryContext(candidateCategories),
				vision,
			});
			classificationRaw = classificationResult.raw;
			classification = classificationResult.json;
		} catch (error) {
			classification = {
				aiError: String(error?.statusMessage || error?.message || "AI analysis failed"),
			};
		}

		if (!candidateCategories.length) {
			candidateCategories = getTopCategoryCandidates({
				description: payload.description,
				location: payload.location,
				vision,
				categories,
				fallbackCategory: fallback.category,
			});
		}

		const category = normalizeCategory({
			value: classification.category,
			fallback: candidateCategories[0]?.key || fallback.category,
			categories: candidateCategories.length ? candidateCategories : categories,
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
		const manualReviewSignals = detectManualReviewSignals({
			description: payload.description,
			vision,
		});
		const forcedGeneralCategory = manualReviewSignals.forcedManualReview;
		const assignedEmployee = !forcedGeneralCategory && chosenEmployee
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
		let confidenceCategory = clampConfidence(
			classification.confidenceCategory,
			category === fallback.category ? 0.66 : 0.58,
		);
		const confidencePriority = clampConfidence(classification.confidencePriority, 0.6);
		let confidencePhoto = clampConfidence(vision.confidencePhoto, 0.5);
		if (forcedGeneralCategory) {
			confidenceCategory = Math.min(confidenceCategory, 0.34);
			confidencePhoto = Math.min(confidencePhoto, 0.24);
		}
		const confidenceLevel = getConfidenceLevel(confidenceCategory, confidencePriority, confidencePhoto);
		const needsCarefulReview =
			confidenceLevel === "medium" ||
			confidenceCategory < CONFIDENCE_THRESHOLDS.high ||
			confidencePriority < CONFIDENCE_THRESHOLDS.high ||
			confidencePhoto < CONFIDENCE_THRESHOLDS.high;
		const hasLowConfidence =
			confidenceCategory < CONFIDENCE_THRESHOLDS.medium ||
			confidencePriority < CONFIDENCE_THRESHOLDS.medium ||
			confidencePhoto < CONFIDENCE_THRESHOLDS.medium;

		const resolvedCategory = forcedGeneralCategory ? "general" : category;
		const resolvedSubCategory = forcedGeneralCategory ? "Уточнение" : subCategory;

		const result = {
			...fallback,
			...classification,
			analysisPipelineVersion: ANALYSIS_PIPELINE_VERSION,
			promptVersion: PROMPT_VERSION,
			category: resolvedCategory,
			subCategory: resolvedSubCategory,
			priority,
			candidateCategories: candidateCategories.map((item) => ({
				key: item.key,
				name: item.name,
				score: item.candidateScore,
				reasons: item.candidateReasons || [],
			})),
			status: "moderation",
			deadlineAt,
			deadlineReason: getDeadlineReason(priority),
			assignedEmployee,
			assignedEmployeeReason: assignedEmployee
				? `Выбран сотрудник ${assignedEmployee.name} с текущей нагрузкой ${assignedEmployee.load}.`
				: forcedGeneralCategory
					? "Сотрудник не назначен автоматически, потому что фото не подтверждает проблему и обращение требует ручной модерации."
					: "Активный сотрудник для назначения не найден.",
			locationCheck,
			locationReason: getLocationReason(payload.location),
			photoObservation,
			photoDetails,
			photoRelevant: vision.photoRelevant,
			photoMismatch: vision.photoMismatch,
			containsPerson: vision.containsPerson,
			isSelfie: vision.isSelfie,
			sceneType: vision.sceneType,
			textPhotoConflictReason: manualReviewSignals.textPhotoConflictReason,
			fraudSignals: manualReviewSignals.fraudSignals,
			moderationFlags: manualReviewSignals.moderationFlags,
			isValidAppeal: true,
			validityReason: validity.validityReason,
			abuseScore: validity.abuseScore,
			relevanceScore: validity.relevanceScore,
			containsHumanPortrait: validity.containsHumanPortrait,
			containsCityProblem: validity.containsCityProblem,
			textPhotoConsistency: validity.textPhotoConsistency,
			rejectionRecommendation: validity.rejectionRecommendation,
			rejectionReason: validity.rejectionReason,
			confidenceCategory,
			confidencePriority,
			confidencePhoto,
			confidenceLevel,
			needsCarefulReview: needsCarefulReview || forcedGeneralCategory,
			shortSummary: buildShortSummary({
				description: payload.description,
				photoObservation,
				shortSummary: classification.shortSummary,
				category: resolvedCategory,
				subCategory: resolvedSubCategory,
			}),
			evidence: evidence.length ? evidence : photoDetails.slice(0, 6),
			uncertainties,
			assumptions: normalizeList(classification.assumptions, 8),
			needsClarification:
				normalizeBoolean(classification.needsClarification) || !locationCheck || vision.photoMismatch || hasLowConfidence || forcedGeneralCategory,
			clarificationReason:
				String(classification.clarificationReason || "").trim() ||
				(forcedGeneralCategory
					? manualReviewSignals.textPhotoConflictReason ||
						"Фото не подтверждает заявленную городскую проблему, поэтому обращение требует ручной проверки модератором."
					: hasLowConfidence
						? "AI указал низкую уверенность, поэтому обращение требует дополнительной проверки."
						: ""),
			categoryReason:
				forcedGeneralCategory
					? "Обращение переведено в общую проверку, потому что фото выглядит нерелевантным или не подтверждает указанную проблему."
					: String(classification.categoryReason || "").trim() ||
						`Категория "${resolvedCategory}" выбрана по совпадению описания, фото-наблюдений и справочника CityHelp.`,
			subCategoryReason:
				forcedGeneralCategory
					? "Подкатегория 'Уточнение' выбрана до ручной проверки модератором."
					: String(classification.subCategoryReason || "").trim() ||
						(resolvedSubCategory ? `Подкатегория "${resolvedSubCategory}" точнее всего описывает выявленный тип проблемы.` : ""),
			priorityReason:
				String(classification.priorityReason || "").trim() ||
				`Приоритет "${priority}" выбран по характеру проблемы и потенциальному влиянию на жителей.`,
			statusReason: "После автоматического анализа обращение отправлено на модерацию для проверки администратором.",
			raw: {
				validity: validity.raw,
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
