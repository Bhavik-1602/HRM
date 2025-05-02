import Joi from "joi";
import { isValidObjectId } from "../../../utils/commonUtils.js";

export const updateEmployeeSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }),

  job_title: Joi.string().trim().allow("").optional(),
  password: Joi.string().min(6).allow("").optional(),

  employee_type: Joi.string()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid"); // Custom error for invalid ObjectId
      }
      return value;
    }).allow("")
    .optional()
    .messages({
      "any.invalid":
        "Invalid employee_type ID. Must be a valid MongoDB ObjectId.",
    }),
    last_working_day_date: Joi.string()
      .pattern(/^\d{2}-\d{2}-\d{4}$/) // Ensure "DD-MM-YYYY" format
      .optional()
      .allow("")
      .messages({
        "string.pattern.base": "Invalid last_working_day_date format. Use DD-MM-YYYY.",
      }),
      status: Joi.boolean().optional(),
      employee_code: Joi.string()
    .trim()
    .min(3)
    .max(15)
    .optional()
    .allow("")
    .messages({
      "string.min": "Employee code must be at least 3 characters long.",
      "string.max": "Employee code must be at most 15 characters long.",
    }),
})
  .or("password", "jobTitle", "employee_type", "employee_code")
  .messages({
    "object.missing":
      "At least one field must be provided for update (password, jobTitle, employee_code or employee_type).",
  });

export const createEmployeeSchema = Joi.object({
  first_name: Joi.string().trim().required().messages({
    "string.empty": "First name is required.",
    "any.required": "First name is required.",
  }),
  last_name: Joi.string().trim().required().messages({
    "string.empty": "Last name is required.",
    "any.required": "Last name is required.",
  }),
  work_email: Joi.string().email().trim().required().messages({
    "string.empty": "Work email is required.",
    "string.email": "Invalid email format.",
    "any.required": "Work email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
  confirm_password: Joi.string()
    .valid(Joi.ref("password")) 
    .required()
    .messages({
      "any.only": "Confirm password must match the password.",
      "any.required": "Confirm password is required.",
    }),
  employee_type: Joi.string().required().messages({
    "string.empty": "Employee type is required.",
    "any.required": "Employee type is required.",
  }),
  employee_code: Joi.string().min(3).max(15).trim().required().messages({
    "string.empty": "Employee code is required.",
    "string.min": "Employee code must be at least 3 characters long.",
    "string.max": "Employee code must be at most 15 characters long.",
    "any.required": "Employee code is required.",
  }),
  joining_date: Joi.string().trim().required()
  .pattern(/^\d{2}-\d{2}-\d{4}$/) // Allows "DD-MM-YYYY" format
  .messages({
    "string.pattern.base": "Joining date must be in 'DD-MM-YYYY' format.",
    "any.required": "Joining date is required.",
  }),
  job_title: Joi.string().trim().required().messages({
    "string.empty": "Job_title is required.",
    "any.required": "Job_title is required.",
  }),
});
