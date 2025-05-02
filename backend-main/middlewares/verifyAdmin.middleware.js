import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../config/responseHandler.config.js";
import { STATUS_CODES } from "../config/constants/httpStatusCodes.js";
import { ADMIN_MESSAGES } from "../config/constants/responseMessage/admin/admin.message.js";
import { COMMON_MESSAGES } from "../config/constants/responseMessage/common.message.js";
import {AdminModel} from "../models/index.js"

const verifyAdmin = async (req, res, next) => {
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
    const admin = await AdminModel.findById(decoded.userId).select("-password");

    if (!admin) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        ADMIN_MESSAGES.ADMIN_NOT_FOUND
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }
    req.user = admin;
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

export default verifyAdmin;
