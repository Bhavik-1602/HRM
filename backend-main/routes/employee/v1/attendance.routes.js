import express from "express";
import { employeeCheckIn, employeeCheckOut, getEmployeeAttendanceRecords } from "../../../controllers/employee/v1/index.js";
import verifyEmployee from "../../../middlewares/verifyEmployee.middleware.js";
import  validateRequest  from '../../../middlewares/validateRequest.js'
import { employeeCheckInSchema, employeeCheckOutSchema } from "../../../config/validation/index.js";

const router = express.Router();

router.post("/check-in", [verifyEmployee,validateRequest(employeeCheckInSchema)], employeeCheckIn);
router.put("/check-out", [verifyEmployee, validateRequest(employeeCheckOutSchema)], employeeCheckOut);
router.get("/records", verifyEmployee, getEmployeeAttendanceRecords);

export default router;
