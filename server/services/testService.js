import { testRepository } from "../repositories/testRepository.js";
import { createErrorResponse } from "../utils/createErrorResponse.js";

export const testService = {
	async getAllTests() {
		return await testRepository.findAll();
	},
};
