import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../config/responseHandler.config.js";
import { STATUS_CODES } from "../config/constants/httpStatusCodes.js";
import { HR_MESSAGES } from "../config/constants/responseMessage/hr/hr.message.js";
import { COMMON_MESSAGES } from "../config/constants/responseMessage/common.message.js";
import {HrModel} from "../models/index.js"

const verifyHr = async (req, res, next) => {
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
    const hr = await HrModel.findById(decoded.userId).select("-password");

    if (!hr) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        HR_MESSAGES.HR_NOT_FOUND
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }
    req.user = hr;
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

export default verifyHr;
