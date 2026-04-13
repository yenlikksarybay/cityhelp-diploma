import { AiTrainingCaseModel } from "../models/AiTrainingCase.js";

const toStringId = (value) => (value ? String(value) : "");

export const createDecisionSnapshot = (appeal) => ({
	description: String(appeal?.description || ""),
	category: String(appeal?.category || ""),
	subCategory: String(appeal?.subCategory || ""),
	priority: String(appeal?.priority || ""),
	status: String(appeal?.status || ""),
	assignedEmployee: appeal?.assignedEmployee?._id || appeal?.assignedEmployee || null,
	deadlineAt: appeal?.deadlineAt || null,
	moderationNote: String(appeal?.moderationNote || ""),
});

export const buildAiDiff = ({ originalDecision = {}, finalDecision = {}, correctedFields = [] }) => {
	const fields = new Set(correctedFields);

	return {
		categoryChanged: originalDecision.category !== finalDecision.category || fields.has("category"),
		subCategoryChanged: originalDecision.subCategory !== finalDecision.subCategory || fields.has("subCategory"),
		priorityChanged: originalDecision.priority !== finalDecision.priority || fields.has("priority"),
		statusChanged: originalDecision.status !== finalDecision.status || fields.has("status"),
		employeeChanged:
			toStringId(originalDecision.assignedEmployee) !== toStringId(finalDecision.assignedEmployee) ||
			fields.has("assignedEmployee"),
		deadlineChanged:
			String(originalDecision.deadlineAt || "") !== String(finalDecision.deadlineAt || "") ||
			fields.has("deadlineAt"),
		descriptionChanged: originalDecision.description !== finalDecision.description || fields.has("description"),
		locationChanged: fields.has("location"),
		photosChanged: fields.has("photos"),
		summaryEdited: fields.has("shortSummary") || fields.has("analysisSummary"),
	};
};

export const createAiTrainingCase = async ({
	appeal,
	moderator,
	source,
	action,
	originalDecision,
	finalDecision,
	correctedFields = [],
	moderatorNote = "",
}) => {
	if (!appeal?._id || !source || !action) return null;

	const normalizedOriginal = originalDecision || createDecisionSnapshot(appeal);
	const normalizedFinal = finalDecision || createDecisionSnapshot(appeal);

	return AiTrainingCaseModel.create({
		appeal: appeal._id,
		moderator: moderator?._id || null,
		source,
		action,
		description: appeal.description || "",
		location: appeal.location || null,
		photos: Array.isArray(appeal.photos) ? appeal.photos : [],
		aiOutput: appeal.aiResult || null,
		originalDecision: normalizedOriginal,
		finalDecision: normalizedFinal,
		correctedFields,
		aiDiff: buildAiDiff({
			originalDecision: normalizedOriginal,
			finalDecision: normalizedFinal,
			correctedFields,
		}),
		moderatorNote,
		promptVersion: Number(appeal.aiResult?.promptVersion || 0) || null,
		analysisPipelineVersion: String(appeal.aiResult?.analysisPipelineVersion || ""),
	});
};
