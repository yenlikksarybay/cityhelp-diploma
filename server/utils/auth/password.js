import crypto from "node:crypto";

const ITERATIONS = 120000;
const KEYLEN = 64;
const DIGEST = "sha512";

export const hashPassword = (password) => {
	const salt = crypto.randomBytes(16).toString("hex");
	const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString("hex");
	return `${salt}:${derivedKey}`;
};

export const verifyPassword = (password, storedHash) => {
	const [salt, hash] = String(storedHash || "").split(":");
	if (!salt || !hash) return false;
	const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString("hex");
	const a = Buffer.from(hash, "hex");
	const b = Buffer.from(derivedKey, "hex");
	return a.length === b.length && crypto.timingSafeEqual(a, b);
};
