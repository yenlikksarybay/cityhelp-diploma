import connectToDatabase from "../config/mongoDB.js";

export default defineNitroPlugin(async () => {
	await connectToDatabase();
});
