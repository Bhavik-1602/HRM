import LeaveBalanceModel from "../../../../models/leavebalance.model.js";
import EmployeeTypeModel from "../../../../models/employeeType.model.js";
import LeaveTypeModel from "../../../../models/leavetype.model.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { sendSuccessResponse, sendErrorResponse } from "../../../../config/responseHandler.config.js";
import { EMPLOYEE_MESSAGES } from "../../../../config/constants/responseMessage/employee/employee.message.js";

// Create or Update Used Leaves
const createOrUpdateLeaveBalance = async (req, res) => {
  try {
    const { leave_balance_id, employee_type, leave_type, used_leaves } = req.body;

    // Validate Employee Type
    const employeeType = await EmployeeTypeModel.findById(employee_type);
    if (!employeeType) {
      const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, EMPLOYEE_MESSAGES.EMPLOYEE_TYPE_NOT_FOUND);
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    // Validate Leave Type
    const leaveType = await LeaveTypeModel.findById(leave_type);
    if (!leaveType) {
      const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, EMPLOYEE_MESSAGES.LEAVE_TYPE_NOT_FOUND);
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    let leaveBalance;

    if (leave_balance_id) {
      // Find existing leave balance
      leaveBalance = await LeaveBalanceModel.findById(leave_balance_id);
      if (!leaveBalance) {
        const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, EMPLOYEE_MESSAGES.LEAVE_BALANCE_NOT_FOUND);
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      // Get total_leaves from EmployeeTypeModel
      const balanceEntry = employeeType.balance.find(
        (b) => b.leave_type.toString() === leave_type.toString()
      );

      if (!balanceEntry) {
        const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, EMPLOYEE_MESSAGES.LEAVE_TYPE_NOT_FOUND);
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      // Ensure used_leaves does not exceed total_leaves
      if (leaveBalance.used_leaves + used_leaves > balanceEntry.total_leaves) {
        const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, EMPLOYEE_MESSAGES.USED_LEAVES_EXCEED);
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
      }

      // Update used_leaves
      leaveBalance.used_leaves += used_leaves;
      await leaveBalance.save();

      const response = sendSuccessResponse(STATUS_CODES.SUCCESS, null, EMPLOYEE_MESSAGES.USED_LEAVES_UPDATED);
      return res.status(STATUS_CODES.SUCCESS).json(response);
    }

    // Check if leave balance already exists
    leaveBalance = await LeaveBalanceModel.findOne({ employee_type, leave_type });
    if (leaveBalance) {
      const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, EMPLOYEE_MESSAGES.LEAVE_BALANCE_ALREADY_EXISTS);
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Create new leave balance (used_leaves starts from 0)
    leaveBalance = await LeaveBalanceModel.create({
      employee_type,
      leave_type,
      used_leaves: 0, // Default used_leaves to 0
    });

    const response = sendSuccessResponse(STATUS_CODES.SUCCESS, { newLeaveBalance: leaveBalance }, EMPLOYEE_MESSAGES.LEAVE_BALANCE_CREATED);
    return res.status(STATUS_CODES.SUCCESS).json(response);

  } catch (error) {
    console.error("Error updating leave balance:", error.message);
    const response = sendErrorResponse(STATUS_CODES.SERVER_ERROR, null, COMMON_MESSAGES.SERVER_ERROR);
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

export default { createOrUpdateLeaveBalance };

