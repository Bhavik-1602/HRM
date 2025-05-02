import { AdminModel } from "../../../../models/index.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { ADMIN_MESSAGES } from "../../../../config/constants/responseMessage/admin/admin.message.js";
import mongoose from "mongoose";

const getAdminProfile = async (req, res) => {
  try {
    // Fetch admin details by ID, excluding sensitive fields
    const admin = await AdminModel.findById(req.user.id).select(
      "-password -reset_password_token -reset_password_expires"
    );

    // If admin not found, return an error response
    if (!admin) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        ADMIN_MESSAGES.ADMIN_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }
    // Return success response with admin data
    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      admin,
      ADMIN_MESSAGES.PROFILE_FETCH_SUCCESS
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

const updateAdminProfile = async (req, res) => {
  try {
    // List of fields allowed to be updated
    const allowedUpdates = [
      "first_name",
      "last_name",
      "phone_number",
      "dob",
      "gender",
      "position_in_the_company",
      "profile_image",
      "permanent_address",
      "temporary_address",
      "blood_group",
      "education_details",
      "emergency_contact",
    ];

    // Extract update fields from request
    const updateFields = Object.keys(req.body);
    const isValidUpdate = updateFields.every((field) =>
      allowedUpdates.includes(field)
    );

    // If any invalid field is found, return an error response
    if (!isValidUpdate) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.INVALID_UPDATE_FIELDS
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Find the admin
    let admin = await AdminModel.findById(req.user.id);
    if (!admin) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        ADMIN_MESSAGES.ADMIN_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    // Update fields only if they exist in req.body
    allowedUpdates.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        admin[field] = req.body[field]; // Allow empty string to reset field
      }
    });

    // Save updated admin profile
    await admin.save();

    // Remove sensitive fields before sending response
    admin = admin.toObject();
    delete admin.password;
    delete admin.reset_password_token;
    delete admin.reset_password_expires;

    // Return success response with updated admin data
    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      admin,
      ADMIN_MESSAGES.PROFILE_UPDATE_SUCCESS
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    console.error("Error updating admin profile:", error);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

export default { getAdminProfile, updateAdminProfile };
