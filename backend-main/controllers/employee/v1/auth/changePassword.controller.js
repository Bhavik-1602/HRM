import bcrypt from "bcrypt";
import { EmployeeModel } from "../../../../models/index.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { EMPLOYEE_MESSAGES } from "../../../../config/constants/responseMessage/employee/employee.message.js";

const changeEmployeePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const employeeId = req.user.id;

    if (!old_password || !new_password) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.ALL_FIELDS_REQUIRED
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    const isMatch = await bcrypt.compare(old_password, employee.password);
    if (!isMatch) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.OLD_PASSWORD_INCORRECT
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    employee.password = new_password;
    await employee.save();

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      null,
      COMMON_MESSAGES.PASSWORD_CHANGED
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    console.error(error);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

export default {changeEmployeePassword};