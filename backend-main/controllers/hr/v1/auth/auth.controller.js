import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HrModel } from "../../../../models/index.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";

// Login for HR
const login = async (req, res) => {
  try {
    const { work_email, password } = req.body;

    if (!work_email || !password) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.INVALID_INPUT
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const hr = await HrModel.findOne({ work_email });
    if (!hr) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.INVALID_EMAIL
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const isMatch = await bcrypt.compare(password, hr.password);
    if (!isMatch) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.INVALID_PASSWORD
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const token = jwt.sign(
      { userId: hr._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const hrData = {
      hr_id: hr._id,
      name: hr.first_name,
      work_email: hr.work_email,
    };

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      hrData,
      COMMON_MESSAGES.LOGGED_IN,
      token
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

export default { login };
