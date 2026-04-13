export const sanitizeUser = (user) => ({
	id: user._id,
	name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
	firstName: user.firstName,
	lastName: user.lastName,
	email: user.email,
	phone: user.phone,
	avatar: user.avatar || null,
	avatarUrl: user.avatar?.url || "",
	role: user.role,
	isActive: user.isActive,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
});
