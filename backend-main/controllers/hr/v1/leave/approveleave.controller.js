import LeaveModel from "../../../../models/leave.model.js";
import LeaveBalanceModel from "../../../../models/leavebalance.model.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import EmployeeModel from "../../../../models/employee.model.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { HR_MESSAGES } from "../../../../config/constants/responseMessage/hr/hr.message.js";

// HR Approve or Reject Leave

const approveLeaveRequest = async (req, res) => {
    try {
      const { leaveId } = req.params;
      const { status } = req.body;
  
      if (!["Approved", "Rejected"].includes(status)) {
        const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, COMMON_MESSAGES.INVALID_INPUT);
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
      }
  
      const leave = await LeaveModel.findById(leaveId);
      if (!leave) {
        const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, HR_MESSAGES.LEAVE_NOT_FOUND);
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }
  
      if (leave.status !== "Pending") {
        const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, HR_MESSAGES.ALREADY_PROCESEED);
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
      }
  
      const timeDiff = leave.end_date - leave.start_date;
      let duration = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      if (leave.halfday_type) duration -= 0.5;
  
      leave.status = status;
  
      if (status === "Approved") {
        let leaveBalance = await LeaveBalanceModel.findOne({
          employee_id: leave.employee_id,
          leave_type: leave.leave_type,
        });
  
        if (!leaveBalance) {
          const employee = await EmployeeModel.findById(leave.employee_id);
          if (!employee) {
            const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, "Employee not found.");
            return res.status(STATUS_CODES.NOT_FOUND).json(response);
          }
  
          leaveBalance = new LeaveBalanceModel({
            employee_id: leave.employee_id,
            leave_type: leave.leave_type,
            used_leaves: duration,
            employee_type: employee.employee_type,
          });
        } else {
          leaveBalance.used_leaves += duration;
        }
  
        await leaveBalance.save();
      }
  
      await leave.save();
      
      const response = sendSuccessResponse(
        STATUS_CODES.SUCCESS,
        { leave },
        `Leave request ${status} successfully`
      );
      
      return res.status(STATUS_CODES.SUCCESS).json(response);
  
    } catch (error) {
      console.error("Error approving leave:", error);
      
      const response = sendErrorResponse(STATUS_CODES.SERVER_ERROR, null, COMMON_MESSAGES.SERVER_ERROR);
      return res.status(STATUS_CODES.SERVER_ERROR).json(response);
    }
  };
  

export default { approveLeaveRequest };
