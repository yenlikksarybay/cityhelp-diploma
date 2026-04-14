import connectToDatabase from "../../config/mongoDB.js";
import { EmployeeRequestModel } from "../../models/EmployeeRequest.js";
import { getAuthUser } from "../../utils/auth/getAuthUser.js";
import { sanitizeUser } from "../../utils/auth/authResponse.js";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	await connectToDatabase(event);
	const user = await getAuthUser(event);
	const latestRequest = await EmployeeRequestModel.findOne({ user: user._id }).sort({ createdAt: -1 }).lean();

	return createSuccessResponse({
		message: "Профиль получен",
		data: {
			...sanitizeUser(user),
			employeeRequest: latestRequest
				? {
						id: String(latestRequest._id),
						status: latestRequest.status,
						message: latestRequest.message || "",
						adminComment: latestRequest.adminComment || "",
						createdAt: latestRequest.createdAt,
						reviewedAt: latestRequest.reviewedAt,
				  }
				: null,
		},
	});
});
