import { deleteCookie } from "h3";
import { createSuccessResponse } from "../../utils/createSuccessResponse.js";

export default defineEventHandler(async (event) => {
	deleteCookie(event, "token", { path: "/" });
	return createSuccessResponse({ message: "Выход выполнен" });
});
