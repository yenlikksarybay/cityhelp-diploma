import { TestModel } from "../models/Test.js";

export const testRepository = {
	findAll() {
		return TestModel.find().sort({ createdAt: -1 }).lean();
	},

	create(payload) {
		return TestModel.create(payload);
	},
};
