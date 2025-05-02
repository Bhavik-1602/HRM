import Joi from 'joi';

export const hrCheckInSchema = Joi.object({
    hr_id: Joi.string().required().messages({
        'string.empty': 'Hr ID is required.'
    })
});

export const hrCheckOutSchema = Joi.object({
    hr_id: Joi.string().required().messages({
        'string.empty': 'Hr ID is required.'
    })
});

export const addAttendanceSchema = Joi.object({
    employee_id: Joi.string().trim().length(24).required().messages({
      "string.base": "Employee ID must be a string",
      "string.length": "Employee ID must be exactly 24 characters",
      "any.required": "Employee ID is required",
    }),
    date: Joi.date().iso().required().messages({
      "date.base": "Date must be a valid date",
      "date.iso": "Date must be in ISO 8601 format (YYYY-MM-DD)",
      "any.required": "Date is required",
    }),
    check_in_time: Joi.date().iso().required().messages({
      "date.base": "Check-in time must be a valid date-time",
      "date.iso": "Check-in time must be in ISO 8601 format",
      "any.required": "Check-in time is required",
    }),
    check_out_time: Joi.date().iso().greater(Joi.ref("check_in_time")).required().messages({
      "date.base": "Check-out time must be a valid date-time",
      "date.iso": "Check-out time must be in ISO 8601 format",
      "date.greater": "Check-out time must be after check-in time",
      "any.required": "Check-out time is required",
    }),
  });
  
export const editAttendanceSchema = Joi.object({
    employee_id: Joi.string().trim().length(24).required().messages({
      "string.base": "Employee ID must be a string",
      "string.length": "Employee ID must be exactly 24 characters",
      "any.required": "Employee ID is required",
    }),
    date: Joi.date().iso().required().messages({
      "date.base": "Date must be a valid date",
      "date.iso": "Date must be in ISO 8601 format (YYYY-MM-DD)",
      "any.required": "Date is required",
    }),
    session_index: Joi.number().integer().min(0).required().messages({
      "number.base": "Session index must be a number",
      "number.integer": "Session index must be an integer",
      "number.min": "Session index must be 0 or higher",
      "any.required": "Session index is required",
    }),
    check_in_time: Joi.date().iso().messages({
      "date.base": "Check-in time must be a valid date-time",
      "date.iso": "Check-in time must be in ISO 8601 format",
    }),
    check_out_time: Joi.date().iso().messages({
      "date.base": "Check-out time must be a valid date-time",
      "date.iso": "Check-out time must be in ISO 8601 format",
    }),
  }).or("check_in_time", "check_out_time").messages({
    "object.missing": "At least one of check-in time or check-out time is required",
  });