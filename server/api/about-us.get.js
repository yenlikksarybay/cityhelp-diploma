import connectToDatabase from "../config/mongoDB.js";
import { AppealModel } from "../models/Appeal.js";
import { UserModel } from "../models/User.js";
import { createSuccessResponse } from "../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);

	const [totalAppeals, totalUsers, totalEmployees, completedAppeals, activeAppeals, ratedAppeals] =
		await Promise.all([
			AppealModel.countDocuments({}),
			UserModel.countDocuments({ role: "user" }),
			UserModel.countDocuments({ role: "employee" }),
			AppealModel.countDocuments({ status: { $in: ["completed", "rated"] } }),
			AppealModel.countDocuments({ status: { $in: ["new", "processing", "needs_revision"] } }),
			AppealModel.countDocuments({ "rating.type": { $ne: null } }),
		]);

	const averageRatingResult = await AppealModel.aggregate([
		{
			$match: {
				"rating.type": { $ne: null },
			},
		},
		{
			$group: {
				_id: null,
				totalRatings: { $sum: 1 },
				positiveRatings: {
					$sum: {
						$cond: [
							{ $eq: ["$rating.type", "like"] },
							1,
							0,
						],
					},
				},
			},
		},
		{
			$project: {
				averageRating: {
					$multiply: [
						{ $divide: ["$positiveRatings", "$totalRatings"] },
						100,
					],
				},
			},
		},
	]);

	const averageRating = averageRatingResult?.[0]?.averageRating || 0;

	return createSuccessResponse({
		message: "О компании получена",
		data: {
			history:
				"City Help создан как единая платформа для прозрачной работы с обращениями граждан. Мы связываем пользователей, администрацию, сотрудников и AI в одном процессе: от подачи обращения до проверки результата и оценки качества.",
			mission:
				"Наша миссия - ускорять реакцию на городские проблемы, помогать сотрудникам работать по приоритетам и делать процесс обращения понятным для каждого жителя.",
			values: [
				"Прозрачность на каждом этапе обращения",
				"AI-подсказка для быстрой первичной обработки",
				"Контроль качества со стороны администрации",
				"Открытая обратная связь и рейтинг результата",
			],
			stats: {
				totalAppeals,
				totalUsers,
				totalEmployees,
				completedAppeals,
				activeAppeals,
				ratedAppeals,
				averageRating: Number(averageRating.toFixed(1)),
			},
		},
	});
});
