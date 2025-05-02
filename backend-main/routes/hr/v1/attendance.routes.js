import express from "express";
import { hrCheckIn, hrCheckOut, getHRAttendanceRecords, addEmployeeAttendance, editEmployeeAttendance } from "../../../controllers/hr/v1/index.js";
import  validateRequest  from '../../../middlewares/validateRequest.js'
import { hrCheckInSchema, hrCheckOutSchema, addAttendanceSchema, editAttendanceSchema } from "../../../config/validation/index.js";
import verifyHr from "../../../middlewares/verifyHr.middleware.js";

const router = express.Router();

router.post("/check-in", [verifyHr,validateRequest(hrCheckInSchema)], hrCheckIn);
router.put("/check-out", [verifyHr, validateRequest(hrCheckOutSchema)], hrCheckOut);
router.get("/records", verifyHr, getHRAttendanceRecords);
router.post("/add", [verifyHr, validateRequest(addAttendanceSchema)], addEmployeeAttendance);
router.put("/edit", [verifyHr, validateRequest(editAttendanceSchema)], editEmployeeAttendance);

export default router;
