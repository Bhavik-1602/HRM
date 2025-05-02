import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import { EmployeeModel } from "../../../../models/index.js";
import { sendMail } from "../../../../config/nodemailer.config.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { ADMIN_MESSAGES } from "../../../../config/constants/responseMessage/admin/admin.message.js";

// Forgot Password API

const forgotPassword = async (req, res) => {
  try {
    const { work_email } = req.body;

    if (!work_email) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.EMAIL_REQUIRED
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const employee = await EmployeeModel.findOne({ work_email});
    if (!employee) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        COMMON_MESSAGES.USER_NOT_EXIST
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    // Generate JWT reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: employee._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    employee.reset_password_token = resetToken;
    employee.reset_password_expires = Date.now() + 3600000; // 1 hour expiry
    await employee.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&work_email=${work_email}`;

    await sendMail(
      employee.work_email,
      "Password Reset Request",
      `Click this link to reset your password: \n ${resetURL}`
    );

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      null,
      COMMON_MESSAGES.PASSWORD_RESET_LINK
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    console.error("Forgot Password Error:", error);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Reset Password API
const resetPassword = async (req, res) => {
  try {
    const { reset_password_token, new_password } = req.body;

    if (!new_password || !reset_password_token) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          sendErrorResponse(
            STATUS_CODES.BAD_REQUEST,
            null,
            PASSWORD_RESET_LINK
          )
        );
    }

    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(reset_password_token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json(
          sendErrorResponse(
            STATUS_CODES.UNAUTHORIZED,
            null,
            COMMON_MESSAGES.INVALID_TOKEN
          )
        );
    }

    // Find employee by id
    const employee = await EmployeeModel.findOne({
      _id: decoded.userId,
      reset_password_expires: { $gt: Date.now() },
    });

    if (!employee) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json(
          sendErrorResponse(
            STATUS_CODES.UNAUTHORIZED,
            null,
            COMMON_MESSAGES.INVALID_TOKEN
          )
        );
    }

    const isSamePassword = await bcrypt.compare(new_password, employee.password);
    if (isSamePassword) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          sendErrorResponse(
            STATUS_CODES.BAD_REQUEST,
            null,
            COMMON_MESSAGES.NEW_PASSWORD
          )
        );
    }

    // Set new password
    employee.password = new_password;

    // Clear reset token fields
    employee.reset_password_token = null;
    employee.reset_password_expires = null;

    // Save updated employee
    await employee.save();

    return res
      .status(STATUS_CODES.SUCCESS)
      .json(
        sendSuccessResponse(
          STATUS_CODES.SUCCESS,
          null,
          ADMIN_MESSAGES.PASSWORD_RESET
        )
      );
  } catch (error) {
    console.error("Reset password error:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json(
        sendErrorResponse(
          STATUS_CODES.SERVER_ERROR,
          null,
          COMMON_MESSAGES.SERVER_ERROR
        )
      );
  }
};

export default { forgotPassword, resetPassword };
