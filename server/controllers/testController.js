import { readBody } from "h3";
import connectToDatabase from "../config/mongoDB.js";
import { testService } from "../services/testService.js";
import { createSuccessResponse } from "../utils/createSuccessResponse.js";

export const getTests = async (event) => {
	await connectToDatabase(event);

	const tests = await testService.getAllTests();

	return createSuccessResponse({
		message: "Список тестовых записей получен",
		data: tests,
		meta: {
			total: tests.length,
		},
	});
};
