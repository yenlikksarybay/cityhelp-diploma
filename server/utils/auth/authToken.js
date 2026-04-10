import crypto from "node:crypto";

const base64Url = (input) =>
	Buffer.from(input)
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");

export const createAuthToken = (payload) => {
	const secret = useRuntimeConfig().authSecret || "cityhelp-secret";
	const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
	const body = base64Url(JSON.stringify(payload));
	const signature = crypto
		.createHmac("sha256", secret)
		.update(`${header}.${body}`)
		.digest("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");

	return `${header}.${body}.${signature}`;
};

export const verifyAuthToken = (token) => {
	try {
		const secret = useRuntimeConfig().authSecret || "cityhelp-secret";
		const [header, body, signature] = String(token || "").split(".");
		if (!header || !body || !signature) return null;
		const expected = crypto
			.createHmac("sha256", secret)
			.update(`${header}.${body}`)
			.digest("base64")
			.replace(/=/g, "")
			.replace(/\+/g, "-")
			.replace(/\//g, "_");
		if (expected !== signature) return null;
		return JSON.parse(Buffer.from(body, "base64").toString("utf8"));
	} catch {
		return null;
	}
};
