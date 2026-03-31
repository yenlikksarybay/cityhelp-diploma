import mongoose from "mongoose";

let cachedConnection = globalThis.__mongooseConnection;
let cachedPromise = globalThis.__mongooseConnectionPromise;

const buildMongoUri = (config) => {
	if (config.mongodbUri) {
		return config.mongodbUri;
	}

	const credentials =
		config.mongodbUser && config.mongodbPassword
			? `${encodeURIComponent(config.mongodbUser)}:${encodeURIComponent(config.mongodbPassword)}@`
			: "";
	const query = credentials ? "?authSource=admin" : "";

	return `mongodb://${credentials}${config.mongodbHost}/${config.mongodbDatabase}${query}`;
};

export const connectToDatabase = async (event) => {
	if (cachedConnection) {
		return cachedConnection;
	}

	if (!cachedPromise) {
		const config = event ? useRuntimeConfig(event) : useRuntimeConfig();
		const mongoUri = buildMongoUri(config);

		cachedPromise = mongoose
			.connect(mongoUri, {
				autoIndex: true,
				serverSelectionTimeoutMS: 5000,
			})
			.catch((error) => {
				cachedPromise = null;
				globalThis.__mongooseConnectionPromise = null;
				throw error;
			});
	}

	cachedConnection = await cachedPromise;
	globalThis.__mongooseConnection = cachedConnection;
	globalThis.__mongooseConnectionPromise = cachedPromise;

	return cachedConnection;
};

export default connectToDatabase;
