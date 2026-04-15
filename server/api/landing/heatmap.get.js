import connectToDatabase from "../../config/mongoDB.js";
import { dashboardService } from "../../services/dashboardService.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);

	const landingHeatmap = await dashboardService.getPublicLandingHeatmap();

	return createSuccessResponse({
		message: "Публичная тепловая карта получена",
		data: landingHeatmap.points,
		meta: {
			total: landingHeatmap.totalPoints,
			totalAppeals: landingHeatmap.totalAppeals,
			activeAppeals: landingHeatmap.activeAppeals,
			completedAppeals: landingHeatmap.completedAppeals,
			rejectedAppeals: landingHeatmap.rejectedAppeals,
		},
	});
});
