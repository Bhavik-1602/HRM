import express from "express";
import { login, forgotPassword, resetPassword, changeEmployeePassword } from "../../../controllers/employee/v1/index.js";
import  validateRequest  from '../../../middlewares/validateRequest.js'
import  verifyEmployee  from '../../../middlewares/verifyEmployee.middleware.js'
import { loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from "../../../config/validation/index.js";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), login);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
router.post("/change-password", [verifyEmployee ,validateRequest(changePasswordSchema)], changeEmployeePassword);

export default router;
