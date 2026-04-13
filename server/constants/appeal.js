export const APPEAL_STATUS_KEYS = [
	"new",
	"moderation",
	"processing",
	"needs_revision",
	"completed",
	"rated",
	"rejected",
];

export const APPEAL_STATUSES = {
	new: {
		label: "Новое",
		variant: "new",
		icon: "time-i",
	},
	moderation: {
		label: "На модерации",
		variant: "moderation",
		icon: "time-i",
	},
	processing: {
		label: "В работе",
		variant: "processing",
		icon: "time-i",
	},
	needs_revision: {
		label: "Нужна доработка",
		variant: "needs_revision",
		icon: "time-i",
	},
	completed: {
		label: "Завершено",
		variant: "completed",
		icon: "checkmark-i",
	},
	rated: {
		label: "Оценено",
		variant: "rated",
		icon: "checkmark-i",
	},
	rejected: {
		label: "Отклонено",
		variant: "rejected",
		icon: "close",
	},
};

export const APPEAL_PRIORITIES = {
	low: {
		label: "Низкий",
		variant: "info",
	},
	medium: {
		label: "Средний",
		variant: "warning",
	},
	high: {
		label: "Высокий",
		variant: "danger",
	},
	urgent: {
		label: "Срочный",
		variant: "danger",
	},
};

export const APPEAL_PRIORITY_DEADLINE_DAYS = {
	low: 7,
	medium: 4,
	high: 3,
	urgent: 1,
};

export const APPEAL_VARIANT_LABELS = {
	info: "В обработке",
	warning: "Требует внимания",
	success: "Успешно",
	danger: "Проблема",
	pending: "В обработке",
	solved: "Успешно",
	rejected: "Проблема",
};

export const APPEAL_STATUS_LIST = APPEAL_STATUS_KEYS;
export const APPEAL_PRIORITY_LIST = Object.keys(APPEAL_PRIORITIES);

export const getAppealStatusMeta = (status) => {
	return APPEAL_STATUSES[String(status || "").toLowerCase()] || null;
};

export const getAppealPriorityMeta = (priority) => {
	return APPEAL_PRIORITIES[String(priority || "").toLowerCase()] || null;
};

export const getAppealVariant = (value) => {
	const normalizedValue = String(value || "").toLowerCase();

	return (
		getAppealStatusMeta(value)?.variant ||
		getAppealPriorityMeta(value)?.variant ||
		{
			pending: "info",
			solved: "success",
			rejected: "danger",
		}[normalizedValue] ||
		"info"
	);
};

export const getAppealLabel = (value) => {
	return (
		getAppealStatusMeta(value)?.label ||
		getAppealPriorityMeta(value)?.label ||
		APPEAL_VARIANT_LABELS[String(value || "").toLowerCase()] ||
		""
	);
};

export const getAppealIcon = (value) => {
	const variant = getAppealVariant(value);

	return getAppealStatusMeta(value)?.icon || (variant === "success" ? "checkmark-i" : variant === "danger" ? "close" : "time-i");
};
