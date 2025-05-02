import Joi from 'joi';

export const employeeCheckInSchema = Joi.object({
    employee_id: Joi.string().required().messages({
        'string.empty': 'Employee ID is required.'
    })
});

export const employeeCheckOutSchema = Joi.object({
    employee_id: Joi.string().required().messages({
        'string.empty': 'Employee ID is required.'
    })
});