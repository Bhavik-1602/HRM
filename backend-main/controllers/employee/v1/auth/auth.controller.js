import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { EmployeeModel } from "../../../../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login for Employee
const login = async (req, res) => {
  try {
    const { work_email, password } = req.body;

    if (!work_email || !password) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.INVALID_EMAIL
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const employee = await EmployeeModel.findOne({ work_email });
    
    if (!employee) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        COMMON_MESSAGES.INVALID_INPUT
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        COMMON_MESSAGES.INVALID_PASSWORD
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    const token = jwt.sign(
      { userId: employee._id, work_email: employee.work_email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const employeeData = {
      employee_id: employee._id,
      name: employee.first_name,
      work_email: employee.work_email,
    };

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      employeeData,
      COMMON_MESSAGES.LOGGED_IN,
      token
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

export default { login };
