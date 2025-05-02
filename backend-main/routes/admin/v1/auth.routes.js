import express from 'express'
import { login, forgotPassword, resetPassword, changeAdminPassword } from '../../../controllers/admin/v1/index.js';
import  validateRequest  from '../../../middlewares/validateRequest.js'
import verifyAdmin from '../../../middlewares/verifyAdmin.middleware.js'
import { adminForgetPasswordSchema, adminLoginSchema, resetPasswordSchema, changePasswordSchema} from "../../../config/validation/index.js";

const router = express.Router();

router.post("/login", validateRequest(adminLoginSchema), login);
router.post("/forgot-password", validateRequest(adminForgetPasswordSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
router.post("/change-password", [verifyAdmin,validateRequest(changePasswordSchema)], changeAdminPassword);

export default router