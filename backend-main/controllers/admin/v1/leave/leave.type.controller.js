import LeaveTypeModel from "../../../../models/leavetype.model.js";
import EmployeeTypeModel from "../../../../models/employeeType.model.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import { EMPLOYEE_MESSAGES } from "../../../../config/constants/responseMessage/employee/employee.message.js";

// Create or Update Leave Type
const createOrUpdateLeaveType = async (req, res) => {
  try {
    const { leave_id, leave_type } = req.body;
    let leaveType;

    if (leave_id) {
      // Update existing leave type
      leaveType = await LeaveTypeModel.findById(leave_id);

      if (!leaveType) {
        const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, EMPLOYEE_MESSAGES.LEAVE_TYPE_NOT_FOUND);
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      // Check if the updated leave_type already exists (excluding the current leave type)
      const existingLeaveType = await LeaveTypeModel.findOne({
        leave_type,
        _id: { $ne: leave_id },
      });

      if (existingLeaveType) {
        const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, EMPLOYEE_MESSAGES.LEAVE_TYPE_ALREADY_EXIST);
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
      }

      leaveType.leave_type = leave_type;
      await leaveType.save();

      const response = sendSuccessResponse(STATUS_CODES.SUCCESS, leaveType, EMPLOYEE_MESSAGES.LEAVE_TYPE_UPDATED);
      return res.status(STATUS_CODES.SUCCESS).json(response);
    }

    // Create new leave type
    const existingLeaveType = await LeaveTypeModel.findOne({ leave_type });

    if (existingLeaveType) {
      const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, EMPLOYEE_MESSAGES.LEAVE_TYPE_ALREADY_EXIST);
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    leaveType = await LeaveTypeModel.create({ leave_type });

    // Add the new leave type to all employee types
    await EmployeeTypeModel.updateMany(
      {}, 
      {
        $push: {
          balance: {
            leave_type: leaveType._id,
            total_leaves: 0,
          },
        },
      }
    );

    const response = sendSuccessResponse(STATUS_CODES.SUCCESS, leaveType, EMPLOYEE_MESSAGES.LEAVE_TYPE_CREATED);
    return res.status(STATUS_CODES.SUCCESS).json(response);
    
  } catch (error) {
    console.error("Error creating/updating leave type:", error.message);
    const response = sendErrorResponse(STATUS_CODES.SERVER_ERROR, null, COMMON_MESSAGES.SERVER_ERROR);
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Fetch all Available Leave Type
const getAllLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveTypeModel.find({}, "_id leave_type")
    .sort({ createdAt: -1 }); // Sort by latest new added leave type;

    let response;
    if (!leaveTypes.length) {
      response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, EMPLOYEE_MESSAGES.NO_LEAVE_TYPES);
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    response = sendSuccessResponse(STATUS_CODES.SUCCESS, leaveTypes, EMPLOYEE_MESSAGES.LEAVE_TYPE_FETCHED);
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    const response = sendErrorResponse(STATUS_CODES.SERVER_ERROR, null, COMMON_MESSAGES.SERVER_ERROR);
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};


export default { createOrUpdateLeaveType, getAllLeaveTypes };

