import Joi from "joi";

export const hrLoginSchema = Joi.object({
  work_email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Invalid email format.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
});

//Validation for forgot password
export const hrForgetPasswordSchema = Joi.object({
  work_email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Invalid work_email format.",
  }),
});

// Validation schema for updating admin profile
export const updateHrProfileSchema = Joi.object({
  first_name: Joi.string().trim().min(2).max(50).optional().allow("").messages({
    "string.min": "First name must be at least 2 characters long.",
    "string.max": "First name must not exceed 50 characters.",
  }),

  last_name: Joi.string().trim().min(2).max(50).optional().allow("").messages({
    "string.min": "Last name must be at least 2 characters long.",
    "string.max": "Last name must not exceed 50 characters.",
  }),

  personal_email: Joi.string().email().optional().allow("").messages({
    "string.email": "Invalid email format. Please enter a valid email address.",
  }),

  personal_phone_number: Joi.string()
    .pattern(/^\d{10}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Personal phone number must be exactly 10 digits.",
    }),

  dob: Joi.date().iso().optional().allow("").messages({
    "date.base":
      "Invalid date format. Please enter a valid date in YYYY-MM-DD format.",
  }),

  gender: Joi.string()
    .valid("male", "female", "other", "not specified")
    .optional()
    .messages({
      "any.only": "Gender must be either 'male', 'female', or 'other'.",
    }),

  marital_status: Joi.string()
    .valid("married", "single", "other", "not specified")
    .optional()
    .messages({
      "any.only": "Marital status must be 'married', 'single', or 'other'.",
    }),

  profile_image: Joi.string().uri().allow(null, "").optional().messages({
    "string.uri": "Profile image must be a valid URL.",
  }),

  department: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .allow("")
    .messages({
      "string.min": "Department name must be at least 2 characters long.",
      "string.max": "Department name must not exceed 100 characters.",
    }),

  blood_group: Joi.string()
    .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "not specified")
    .optional()
    .messages({
      "any.only":
        "Blood group must be one of: A+, A-, B+, B-, O+, O-, AB+, AB-.",
    }),

  permanent_address: Joi.object({
    street1: Joi.string().trim().max(100).allow(null, "").optional(),
    street2: Joi.string().trim().max(100).allow(null, "").optional(),
    city: Joi.string().trim().max(50).allow(null, "").optional(),
    state: Joi.string().trim().max(50).allow(null, "").optional(),
    postal_code: Joi.string()
      .pattern(/^\d{5,6}$/)
      .allow(null, "")
      .optional()
      .messages({
        "string.pattern.base": "Postal code must be 5 or 6 digits.",
      }),
    country: Joi.string()
      .valid("India", "USA", "Canada", "UK", "Australia")
      .allow("")
      .optional(),
  }).optional(),

  temporary_address: Joi.object({
    street1: Joi.string().trim().max(100).allow(null, "").optional(),
    street2: Joi.string().trim().max(100).allow(null, "").optional(),
    city: Joi.string().trim().max(50).allow(null, "").optional(),
    state: Joi.string().trim().max(50).allow(null, "").optional(),
    postal_code: Joi.string()
      .pattern(/^\d{5,6}$/)
      .allow(null, "")
      .optional()
      .messages({
        "string.pattern.base": "Postal code must be 5 or 6 digits.",
      }),
    country: Joi.string()
      .valid("India", "USA", "Canada", "UK", "Australia")
      .allow("")
      .optional(),
  }).optional(),

  education_details: Joi.object({
    degree: Joi.string().trim().allow(null, "").optional(),
    university_name: Joi.string().trim().allow(null, "").optional(),
    college_name: Joi.string().trim().allow(null, "").optional(),
    passing_year: Joi.string()
      .trim()
      .pattern(/^\d{4}$/)
      .allow(null, "")
      .optional()
      .messages({
        "string.pattern.base": "Passing year must be a 4-digit year.",
      }),
  }).optional(),

  emergency_contact: Joi.object({
    name: Joi.string().trim().allow(null, "").optional(),
    relationship: Joi.string().trim().allow(null, "").optional(),
    phone: Joi.string()
      .pattern(/^\d{10}$/)
      .allow(null, "")
      .optional()
      .messages({
        "string.pattern.base":
          "Emergency contact phone must be exactly 10 digits.",
      }),
  }).optional(),

  original_doc_submitted: Joi.boolean().optional().allow(""),

  original_doc_name: Joi.string()
    .trim()
    .max(255)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Original document name must not exceed 255 characters.",
    }),

  proof_doc: Joi.string().trim().max(255).allow(null, "").optional().messages({
    "string.max": "Proof document must not exceed 255 characters.",
  }),
  proof_doc_name: Joi.string()
    .trim()
    .max(255)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Proof document name must not exceed 255 characters.",
    }),
  reports_to: Joi.string().trim().min(2).max(50).allow("").optional().messages({
    "string.min": "reports_to must be at least 2 characters long.",
    "string.max": "reports_to must not exceed 50 characters.",
  }),
});
