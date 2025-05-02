import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../config/responseHandler.config.js";
import { STATUS_CODES } from "../config/constants/httpStatusCodes.js";
import { EMPLOYEE_MESSAGES } from "../config/constants/responseMessage/employee/employee.message.js";
import { COMMON_MESSAGES } from "../config/constants/responseMessage/common.message.js";
import {EmployeeModel} from "../models/index.js"

const verifyEmployee = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        COMMON_MESSAGES.NO_TOKEN
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const employee = await EmployeeModel.findById(decoded.userId).select("-password");

    if (!employee) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }
    req.user = employee;
    next();
  } catch (error) {
    const response = sendErrorResponse(
      STATUS_CODES.UNAUTHORIZED,
      null,
      COMMON_MESSAGES.INVALID_TOKEN
    );
    return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
  }
};

export default verifyEmployee;
