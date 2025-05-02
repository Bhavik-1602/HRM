import express from "express";
import  validateRequest from "../../../middlewares/validateRequest.js";
import { updateAdminProfileSchema } from "../../../config/validation/index.js";
import verifyAdmin  from "../../../middlewares/verifyAdmin.middleware.js";
import {getAdminProfile, updateAdminProfile} from "../../../controllers/admin/v1/index.js"

const router = express.Router();

router.get("/profile", verifyAdmin, getAdminProfile);
router.put("/edit", [verifyAdmin, validateRequest(updateAdminProfileSchema)], updateAdminProfile);

export default router;