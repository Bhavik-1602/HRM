import Joi from "joi";

export const leaveTypeSchema = Joi.object({
  leave_id: Joi.string().optional().messages({
    "string.base": "Leave ID must be a string.",
  }),
  leave_type: Joi.string().required().messages({
    "string.base": "Leave type must be a string.",
    "any.required": "Leave type is required.",
  }),
});

