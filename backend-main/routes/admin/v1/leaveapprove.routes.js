import express from 'express'
import { createOrUpdateEmployeeType, createOrUpdateLeaveType, getAllEmployeeTypes, getAllLeaveTypes, updateLeaveBalances } from "../../../controllers/admin/v1/index.js";
import verifyAdmin from '../../../middlewares/verifyAdmin.middleware.js';
import validateRequest from '../../../middlewares/validateRequest.js';
import { employeeTypeSchema, leaveTypeSchema, updateLeaveBalanceSchema } from '../../../config/validation/index.js';

const router = express.Router()

router.post("/leave-type", verifyAdmin, validateRequest(leaveTypeSchema), createOrUpdateLeaveType); // Create or Update Leave Type
router.get("/fetch-leavetype", verifyAdmin, getAllLeaveTypes); // fetch all leave types
router.post("/employee-type", verifyAdmin, validateRequest(employeeTypeSchema), createOrUpdateEmployeeType); // Create or Update Employee Type
router.put("/leave-balance", verifyAdmin, validateRequest(updateLeaveBalanceSchema), updateLeaveBalances); // Update Leave Balance
router.get("/fetch-employeetype", verifyAdmin, getAllEmployeeTypes); // fetch all employee types

export default router