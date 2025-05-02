import Joi from 'joi';

export const leaveBalanceSchema = Joi.object({
    employee_id: Joi.string().required().messages({
        'string.empty': 'Employee ID cannot be empty.',
        'any.required': 'Employee ID is required.',
      }),
    leave_balance_id: Joi.string().optional().messages({
      'string.empty': 'Leave balance ID cannot be empty if provided.',
    }),
    employee_type: Joi.string().required().messages({
      'any.required': 'Employee type is required.',
      'string.empty': 'Employee type cannot be empty.',
    }),
    leave_type: Joi.string().required().messages({
      'any.required': 'Leave type is required.',
      'string.empty': 'Leave type cannot be empty.',
    })
})

