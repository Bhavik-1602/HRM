import express from "express";
import { applyLeave, getEmployeeLeaves, getEmployeeLeaveBalance, editLeaveRequest, getAllLeaveTypes } from "../../../controllers/employee/v1/index.js";
import verifyEmployee from "../../../middlewares/verifyEmployee.middleware.js";
import { uploadMiddleware }from "../../../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/apply", verifyEmployee, uploadMiddleware, applyLeave);
router.get("/records", verifyEmployee,  getEmployeeLeaves);
router.get('/balance', verifyEmployee, getEmployeeLeaveBalance);
router.put('/:leaveId', verifyEmployee, uploadMiddleware, editLeaveRequest);
router.get('/fetch-leavetype', verifyEmployee, getAllLeaveTypes);


export default router;
