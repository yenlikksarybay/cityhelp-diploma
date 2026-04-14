import mongoose from "mongoose";

const EMPLOYEE_REQUEST_STATUSES = ["pending", "approved", "rejected"];

const employeeRequestSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		status: {
			type: String,
			enum: EMPLOYEE_REQUEST_STATUSES,
			default: "pending",
			index: true,
		},
		message: {
			type: String,
			trim: true,
			default: "",
		},
		adminComment: {
			type: String,
			trim: true,
			default: "",
		},
		reviewedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		reviewedAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

employeeRequestSchema.index({ user: 1, createdAt: -1 });

export const EmployeeRequestModel =
	mongoose.models.EmployeeRequest || mongoose.model("EmployeeRequest", employeeRequestSchema);

export { EMPLOYEE_REQUEST_STATUSES };
