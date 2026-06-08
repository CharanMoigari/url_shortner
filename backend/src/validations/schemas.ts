import Joi from 'joi';

// Validation schemas

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createURLSchema = Joi.object({
  originalUrl: Joi.string().uri().required().messages({
    'string.uri': 'Please provide a valid URL',
    'any.required': 'Original URL is required',
  }),
  customAlias: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .optional()
    .messages({
      'string.alphanum': 'Custom alias can only contain alphanumeric characters',
      'string.min': 'Custom alias must be at least 3 characters',
    }),
  expiresAt: Joi.date().iso().optional().greater('now').messages({
    'date.greater': 'Expiration date must be in the future',
  }),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().optional(),
  sort: Joi.string()
    .valid('createdAt', 'clickCount', 'shortCode')
    .default('createdAt')
    .optional(),
});

export const validate = (data: any, schema: Joi.ObjectSchema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return { error: messages.join(', '), value: null };
  }

  return { error: null, value };
};
