import Joi from 'joi';

/** Create Holiday Validation */
export const createHolidayValidation = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Holiday name is required",
  }),
  date: Joi.date().required().messages({
    "date.base": "Invalid date format",
    "any.required": "Holiday date is required",
  }),
});

/** Update Holiday Validation (Optional Fields) */
export const updateHolidayValidation = Joi.object({
    name: Joi.string().trim().optional().messages({
      "string.empty": "Holiday name cannot be empty",
    }),
    date: Joi.date().optional().messages({
      "date.base": "Invalid date format",
    }),
  }).min(1); // Ensure at least one field is updated
