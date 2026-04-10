import mongoose from "mongoose";

const ROLE_IDS = ["superadmin", "admin", "employee", "user"];

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			index: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			index: true,
		},
		passwordHash: {
			type: String,
			required: true,
			select: false,
		},
		role: {
			type: String,
			enum: ROLE_IDS,
			default: "user",
			index: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export { ROLE_IDS };
