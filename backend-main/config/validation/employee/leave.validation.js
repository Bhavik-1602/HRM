import Joi from 'joi';

// Updated Joi Validation for Leave Balance Management
export const updateLeaveBalanceSchema = Joi.object({
    employee_type: Joi.string().required().messages({
        'any.required': 'Category name is required.',
        'string.empty': 'Category name cannot be empty.'
    }),

    leave_type: Joi.string().required().messages({
        'any.required': 'Leave type is required.',
        'string.empty': 'Leave type cannot be empty.'
    }),

    total_leaves: Joi.number().min(0).required().messages({
        'number.base': 'Total leaves must be a number.',
        'number.min': 'Total leaves cannot be negative.',
        'any.required': 'Total leaves is required.'
    })
})
