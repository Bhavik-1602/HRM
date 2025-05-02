import { STATUS_CODES } from "../config/constants/httpStatusCodes.js";
import { sendErrorResponse } from "../config/responseHandler.config.js";
import { COMMON_MESSAGES } from "../config/constants/responseMessage/common.message.js";

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      const response = sendErrorResponse(
        STATUS_CODES.FORBIDDEN,
        null,
        COMMON_MESSAGES.NO_TOKEN
      );
      return res.status(STATUS_CODES.FORBIDDEN).json(response);
    }
    next();
  };
};

export default authorize;
