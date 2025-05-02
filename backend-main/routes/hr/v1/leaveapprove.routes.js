import express from "express";
import { approveLeaveRequest, createOrUpdateEmployeeType, updateLeaveBalances, createOrUpdateLeaveType, createOrUpdateLeaveBalance, getAllLeaveTypes, getAllEmployeeTypes, getAllAppliedLeaves } from "../../../controllers/hr/v1/index.js";
import verifyHr from "../../../middlewares/verifyHr.middleware.js";
import  validateRequest  from '../../../middlewares/validateRequest.js'
import { approveLeaveSchema, employeeTypeSchema, leaveTypeSchema, updateLeaveBalanceSchema, leaveBalanceSchema } from "../../../config/validation/index.js";

const router = express.Router();

router.post("/employee-type", verifyHr, validateRequest(employeeTypeSchema), createOrUpdateEmployeeType); // Create or Update Employee Type
router.post("/leave-type", verifyHr, validateRequest(leaveTypeSchema), createOrUpdateLeaveType); // Create or Update Leave Type
router.post("/balance-leave", verifyHr, validateRequest(leaveBalanceSchema), createOrUpdateLeaveBalance); // Create or Update Leave Balance
router.put("/approve-leave/:leaveId", verifyHr, validateRequest(approveLeaveSchema), approveLeaveRequest);
router.put("/leave-balance", verifyHr, validateRequest(updateLeaveBalanceSchema), updateLeaveBalances); // Update Leave Balance
router.get("/fetch-leavetype", verifyHr, getAllLeaveTypes); // fetch all leave types
router.get("/fetch-employeetype", verifyHr, getAllEmployeeTypes); // fetch all employee types
router.get("/fetch-employeeleaves", verifyHr, getAllAppliedLeaves); // fetch all employee leaves
export default router