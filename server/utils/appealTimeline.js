const toText = (value, fallback = "—") => {
	const text = String(value || "").trim();
	return text || fallback;
};

export const createAppealTimelineEntry = ({
	type = "system",
	role = "system",
	authorName = "",
	title = "",
	text = "",
	statusFrom = null,
	statusTo = null,
	meta = {},
	createdAt = new Date(),
}) => {
	return {
		type: toText(type, "system"),
		role: toText(role, "system"),
		authorName: toText(authorName, ""),
		title: toText(title, ""),
		text: toText(text, ""),
		statusFrom: statusFrom ? String(statusFrom) : null,
		statusTo: statusTo ? String(statusTo) : null,
		meta: meta && typeof meta === "object" ? meta : {},
		createdAt,
	};
};

export const normalizeAppealTimeline = (timeline = []) => {
	return (Array.isArray(timeline) ? timeline : [])
		.map((item) => createAppealTimelineEntry(item))
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const getAppealClosedAt = (timeline = []) => {
	const normalized = normalizeAppealTimeline(timeline);
	const closingEntry = [...normalized]
		.reverse()
		.find((item) => ["completed", "rated", "rejected"].includes(String(item.statusTo || "").toLowerCase()));

	return closingEntry?.createdAt || null;
};

export const getAppealRoadmap = (timeline = []) => {
	return normalizeAppealTimeline(timeline)
		.filter((item) => item.statusFrom || item.statusTo)
		.map((item) => ({
			title: item.title || "Изменение статуса",
			text: item.text || "",
			statusFrom: item.statusFrom || null,
			statusTo: item.statusTo || null,
			createdAt: item.createdAt,
			role: item.role || "system",
			authorName: item.authorName || "",
		}));
};
