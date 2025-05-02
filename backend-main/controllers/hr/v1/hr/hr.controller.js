import { HrModel } from "../../../../models/index.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { HR_MESSAGES } from "../../../../config/constants/responseMessage/hr/hr.message.js";
import mongoose from "mongoose";

const getHrProfile = async (req, res) => {
  try {
    // Fetch hr details by ID, excluding sensitive fields
    const hr = await HrModel.findById(req.user.id).select(
      "-password -reset_password_token -reset_password_expires"
    ).populate({
      path: "employee_type",
      select: "employee_type", // Only include `employee_type` and `_id`
    });;

    // If hr not found, return an error response
    if (!hr) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        HR_MESSAGES.HR_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }
    // Return success response with hr data
    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      hr,
      HR_MESSAGES.PROFILE_FETCH_SUCCESS
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

const updateHrProfile = async (req, res) => {
  try {
    // List of fields allowed to be updated
    const allowedUpdates = [
      "first_name",
      "last_name",
      "personal_email",
      "personal_phone_number",
      "dob",
      "gender",
      "marital_status",
      "profile_image",
      "department",
      "reports_to",
      "permanent_address",
      "temporary_address",
      "blood_group",
      "original_doc_submitted",
      "original_doc_name",
      "proof_doc",
      "proof_doc_name",
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

    // Find the hr
    let hr = await HrModel.findById(req.user.id);
    if (!hr) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        HR_MESSAGES.HR_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    // Update fields only if they exist in req.body
    allowedUpdates.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        hr[field] = req.body[field]; // Allow empty string to reset field
      }
    });
    // Save updated hr profile
    await hr.save();

    // Remove sensitive fields before sending response
    hr = hr.toObject();
    delete hr.password;
    delete hr.reset_password_token;
    delete hr.reset_password_expires;

    // Return success response with updated hr data
    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      hr,
      HR_MESSAGES.PROFILE_UPDATE_SUCCESS
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    console.error("Error updating hr profile:", error);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

export default { getHrProfile, updateHrProfile };
