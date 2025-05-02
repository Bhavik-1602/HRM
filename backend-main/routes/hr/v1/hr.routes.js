import express from "express";
import  validateRequest from "../../../middlewares/validateRequest.js";
import { updateHrProfileSchema } from "../../../config/validation/index.js";
import verifyHr  from "../../../middlewares/verifyHr.middleware.js";
import {getHrProfile, updateHrProfile} from "../../../controllers/hr/v1/index.js"

const router = express.Router();

router.get("/profile", verifyHr, getHrProfile);
router.put("/edit", [verifyHr, validateRequest(updateHrProfileSchema)], updateHrProfile);

export default router;