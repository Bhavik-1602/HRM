import Joi from 'joi';

// Validation for Approve or Reject Leave
export const approveLeaveSchema = Joi.object({
    status: Joi.string()
        .valid("Approved", "Rejected")
        .required()
        .messages({
            "any.only": "Status must be either 'Approved' or 'Rejected'.",
            "any.required": "Status is required."
        })
})