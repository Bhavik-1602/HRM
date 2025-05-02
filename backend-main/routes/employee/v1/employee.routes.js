import express from "express";
import  validateRequest from "../../../middlewares/validateRequest.js";
import { updateEmployeeProfileSchema } from "../../../config/validation/index.js";
import verifyEmployee  from "../../../middlewares/verifyEmployee.middleware.js";
import {getEmployeeProfile, updateEmployeeProfile} from "../../../controllers/employee/v1/index.js"

const router = express.Router();

router.get("/profile", verifyEmployee, getEmployeeProfile);
router.put("/edit", [verifyEmployee, validateRequest(updateEmployeeProfileSchema)], updateEmployeeProfile);

export default router;