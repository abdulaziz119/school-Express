import Joi from 'joi';

const phoneRegex = /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/;

export const StudentSchema = Joi.object({
    first_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name must not exceed 50 characters'
        }),

    last_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name must not exceed 50 characters'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address'
        }),

    phone: Joi.string()
        .pattern(phoneRegex)
        .messages({
            'string.pattern.base': 'Please enter a valid Uzbekistan phone number (998xxxxxxxxx)'
        })
        .optional(),

    status: Joi.number()
        .valid(0, 1)
        .default(1)
        .messages({
            'any.only': 'Status must be either 0 or 1'
        })
});

export const studentQuerySchema = Joi.object({
    page: Joi.number()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'Page must be a number',
            'number.min': 'Page must be greater than 0'
        }),

    limit: Joi.number()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.base': 'Limit must be a number',
            'number.min': 'Limit must be greater than 0',
            'number.max': 'Limit cannot exceed 100'
        }),

    status: Joi.number()
        .valid(0, 1)
        .optional()
        .messages({
            'any.only': 'Status must be either 0 or 1'
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Please enter a valid email address for search'
        })
});