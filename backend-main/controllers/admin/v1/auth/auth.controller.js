import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminModel } from "../../../../models/index.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";

// Login for Admin
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

    const admin = await AdminModel.findOne({ work_email });

    if (!admin) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        COMMON_MESSAGES.USER_NOT_FOUND
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        COMMON_MESSAGES.INVALID_PASSWORD
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    const token = jwt.sign(
      { userId: admin._id, work_email: admin.work_email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const adminData = {
      admin_id: admin._id,
      name: admin.first_name,
      work_email: admin.work_email
    };

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      adminData,
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
