import express from 'express'
import {login, forgotPassword, resetPassword, changeHrPassword} from '../../../controllers/hr/v1/index.js'
import  validateRequest  from '../../../middlewares/validateRequest.js'
import  verifyHr  from '../../../middlewares/verifyHr.middleware.js'
import { hrLoginSchema, hrForgetPasswordSchema, resetPasswordSchema, changePasswordSchema } from "../../../config/validation/index.js";

const router = express.Router();

router.post("/login", validateRequest(hrLoginSchema), login);
router.post("/forgot-password", validateRequest(hrForgetPasswordSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
router.post("/change-password", [verifyHr,validateRequest(changePasswordSchema)], changeHrPassword);

export default router