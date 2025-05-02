import Joi from "joi";

// Joi schema for employee type validation
export const employeeTypeSchema = Joi.object({
  employee_type_id: Joi.string().optional().messages({
    "string.base": "Employee type ID must be a string.",
  }),
  employee_type: Joi.string().required().messages({
    "string.base": "Employee type must be a string.",
    "any.required": "Employee type is required.",
    "string.empty": "Employee type cannot be empty.",
  }),
});

// update leave balance

export const updateLeaveBalanceSchema = Joi.object({
    employee_type_id: Joi.string().required().messages({
      'string.empty': 'Employee type ID cannot be empty.',
      'any.required': 'Employee type ID is required.',
    }),
    leave_type_id: Joi.string().required().messages({
      'string.empty': 'Leave type ID cannot be empty.',
      'any.required': 'Leave type ID is required.',
    }),
    total_leaves: Joi.number().min(0).required().messages({
      'number.base': 'Total leaves must be a number.',
      'number.min': 'Total leaves cannot be negative.',
      'any.required': 'Total leaves is required.',
    }),
  });

