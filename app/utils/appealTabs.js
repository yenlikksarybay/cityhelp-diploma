export function buildAppealTabs(tabs = [], meta = {}) {
	const counts = meta?.statusCounts || {};
	const total = meta?.total;

	return (Array.isArray(tabs) ? tabs : []).map((tab) => {
		const value = String(tab?.value || "");
		let count = tab?.count;

		if (value === "all" && Number.isFinite(Number(total))) {
			count = Number(total);
		} else if (counts[value] !== undefined) {
			count = counts[value];
		}

		return {
			...tab,
			count,
		};
	});
}
