import EmployeeTypeModel from "../../../../models/employeeType.model.js";
import LeaveTypeModel from "../../../../models/leavetype.model.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { sendSuccessResponse, sendErrorResponse } from "../../../../config/responseHandler.config.js";
import { EMPLOYEE_MESSAGES } from "../../../../config/constants/responseMessage/employee/employee.message.js";

const createOrUpdateEmployeeType = async (req, res) => {
  try {
    const { employee_type_id, employee_type } = req.body;
    let employeeType;

    if (employee_type_id) {
      employeeType = await EmployeeTypeModel.findById(employee_type_id);
      if (!employeeType) {
        const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, EMPLOYEE_MESSAGES.EMPLOYEE_TYPE_NOT_FOUND);
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      const existingEmployeeType = await EmployeeTypeModel.findOne({
        employee_type,
        _id: { $ne: employee_type_id },
      });

      if (existingEmployeeType) {
        const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, EMPLOYEE_MESSAGES.EMPLOYEE_TYPE_ALREADY_EXISTS);
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
      }

      employeeType.employee_type = employee_type;
      await employeeType.save();

      const updatedEmployeeType = await EmployeeTypeModel.findById(employee_type_id)
        .populate("balance.leave_type", "leave_type");

      const formattedResponse = formatEmployeeTypeResponse(updatedEmployeeType);

      const response = sendSuccessResponse(STATUS_CODES.SUCCESS, formattedResponse, EMPLOYEE_MESSAGES.EMPLOYEE_TYPE_UPDATED);
      return res.status(STATUS_CODES.SUCCESS).json(response);
    }

    const existingEmployeeType = await EmployeeTypeModel.findOne({ employee_type });

    if (existingEmployeeType) {
      const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, EMPLOYEE_MESSAGES.EMPLOYEE_TYPE_ALREADY_EXISTS);
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const leave_types = await LeaveTypeModel.find({});
    if (!leave_types.length) {
      const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, COMMON_MESSAGES.NO_LEAVE_TYPES);
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const defaultBalance = leave_types.map((leaveType) => ({
      leave_type: leaveType._id,
      total_leaves: 0,
    }));

    employeeType = await EmployeeTypeModel.create({
      employee_type,
      balance: defaultBalance,
    });

    const newEmployeeType = await EmployeeTypeModel.findById(employeeType._id)
      .populate("balance.leave_type", "leave_type");

    const formattedResponse = formatEmployeeTypeResponse(newEmployeeType);

    const response = sendSuccessResponse(STATUS_CODES.SUCCESS, formattedResponse, EMPLOYEE_MESSAGES.EMPLOYEE_TYPE_CREATED);
    return res.status(STATUS_CODES.SUCCESS).json(response);

  } catch (error) {
    console.error("Error creating/updating employee type:", error);
    const response = sendErrorResponse(STATUS_CODES.SERVER_ERROR, null, COMMON_MESSAGES.SERVER_ERROR);
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Update Leave Balance for an Employee type
const updateLeaveBalances = async (req, res) => {
  try {
    const { employee_type_id, leave_type_id, total_leaves } = req.body;

    if (!employee_type_id || !leave_type_id || total_leaves === undefined) {
      const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, COMMON_MESSAGES.MISSING_FIELDS);
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    if (typeof total_leaves !== "number" || total_leaves < 0) {
      const response = sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, EMPLOYEE_MESSAGES.INVALID_LEAVE_COUNT);
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const employeeType = await EmployeeTypeModel.findById(employee_type_id);
    if (!employeeType) {
      const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, EMPLOYEE_MESSAGES.EMPLOYEE_TYPE_NOT_FOUND);
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    const balanceEntry = employeeType.balance.find(
      (item) => item.leave_type.toString() === leave_type_id
    );

    if (!balanceEntry) {
      const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, EMPLOYEE_MESSAGES.LEAVE_TYPE_NOT_FOUND);
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    balanceEntry.total_leaves = total_leaves;
    await employeeType.save();

    const updatedEmployeeType = await EmployeeTypeModel.findById(employee_type_id)
      .populate("balance.leave_type", "leave_type");

    const response = sendSuccessResponse(STATUS_CODES.SUCCESS, formatEmployeeTypeResponse(updatedEmployeeType), EMPLOYEE_MESSAGES.LEAVE_BALANCE_UPDATED);
    return res.status(STATUS_CODES.SUCCESS).json(response);

  } catch (error) {
    console.error("Error in updateLeaveBalances:", error);
    const response = sendErrorResponse(STATUS_CODES.SERVER_ERROR, null, COMMON_MESSAGES.SERVER_ERROR);
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Helper: Format employee type response consistently
const formatEmployeeTypeResponse = (employeeType) => ({
  _id: employeeType._id,
  employee_type: employeeType.employee_type,
  balance: employeeType.balance.map((item) => ({
    _id: item.leave_type._id,
    leave_type: item.leave_type.leave_type,
    total_leaves: item.total_leaves,
  })),
  createdAt: employeeType.createdAt,
  updatedAt: employeeType.updatedAt,
  __v: employeeType.__v,
});

// Fetch all available employee types
const getAllEmployeeTypes = async (req, res) => {
  try {
    const employeeTypes = await EmployeeTypeModel.find({}, "_id employee_type");

    if (!employeeTypes.length) {
      const response = sendErrorResponse(STATUS_CODES.NOT_FOUND, null, EMPLOYEE_MESSAGES.EMPLOYEE_TYPE_NOT_FOUND);
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    const response = sendSuccessResponse(STATUS_CODES.SUCCESS, employeeTypes, EMPLOYEE_MESSAGES.EMPLOYEE_FETCHED);
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    const response = sendErrorResponse(STATUS_CODES.SERVER_ERROR, null, COMMON_MESSAGES.SERVER_ERROR);
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};



export default { createOrUpdateEmployeeType, updateLeaveBalances, getAllEmployeeTypes };
