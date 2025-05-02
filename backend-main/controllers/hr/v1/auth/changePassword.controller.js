import bcrypt from "bcrypt";
import { HrModel } from "../../../../models/index.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { HR_MESSAGES } from "../../../../config/constants/responseMessage/hr/hr.message.js";

const changeHrPassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const hrId = req.user.id;

    if (!old_password || !new_password) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.ALL_FIELDS_REQUIRED
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const hr = await HrModel.findById(hrId);
    if (!hr) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        HR_MESSAGES.HR_NOT_FOUND
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    const isMatch = await bcrypt.compare(old_password, hr.password);
    if (!isMatch) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.OLD_PASSWORD_INCORRECT
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    hr.password = new_password;
    await hr.save();

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

export default {changeHrPassword};