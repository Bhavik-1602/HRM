import { EmployeeModel } from "../../../../models/index.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { EMPLOYEE_MESSAGES } from "../../../../config/constants/responseMessage/employee/employee.message.js";
import mongoose from "mongoose";

const getEmployeeProfile = async (req, res) => {
  try {
    // Fetch employee details by ID, excluding sensitive fields
    const employee = await EmployeeModel.findById(req.user.id)
      .select("-password -reset_password_token -reset_password_expires")
      .populate({
        path: "employee_type",
        select: "employee_type", // Only include `employee_type` and `_id`
      });

    // If employee not found, return an error response
    if (!employee) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }
    // Return success response with employee data
    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      employee,
      EMPLOYEE_MESSAGES.PROFILE_FETCH_SUCCESS
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

const updateEmployeeProfile = async (req, res) => {
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
      "permanent_address",
      "temporary_address",
      "blood_group",
      "education_details",
      "emergency_contact",
      "original_doc_submitted",
      "original_doc_name",
      "proof_doc",
      "reports_to",
      "proof_doc_name",
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

    // Find the employee
    let employee = await EmployeeModel.findById(req.user.id);
    if (!employee) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    // Update fields only if they exist in req.body
    allowedUpdates.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        employee[field] = req.body[field]; // Allow empty string to reset field
      }
    });

    // Save updated employee profile
    await employee.save();

    // Remove sensitive fields before sending response
    employee = employee.toObject();
    delete employee.password;
    delete employee.reset_password_token;
    delete employee.reset_password_expires;

    // Return success response with updated employee data
    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      employee,
      EMPLOYEE_MESSAGES.PROFILE_UPDATE_SUCCESS
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    console.error("Error updating employee profile:", error);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

export default { getEmployeeProfile, updateEmployeeProfile };
