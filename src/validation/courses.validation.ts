import Joi from 'joi';

const languageSchema = Joi.object({
    uz: Joi.string().required().messages({
        'string.empty': 'Uzbek title is required',
        'any.required': 'Uzbek title is required'
    }),
    ru: Joi.string().optional(),
    en: Joi.string().optional()
});

export const createCourseSchema = Joi.object({
    title: languageSchema.required(),
    description: Joi.object({
        uz: Joi.string(),
        ru: Joi.string(),
        en: Joi.string()
    }).optional(),
    duration: Joi.number().required().min(1).messages({
        'number.base': 'Duration must be a number',
        'number.min': 'Duration must be greater than 0',
        'any.required': 'Duration is required'
    }),
    status: Joi.number().valid(0, 1).default(1).messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 or 1'
    })
});

export const updateCourseSchema = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'Invalid course ID',
        'any.required': 'Course ID is required'
    }),
    title: languageSchema.optional(),
    description: Joi.object({
        uz: Joi.string(),
        ru: Joi.string(),
        en: Joi.string()
    }).optional(),
    duration: Joi.number().min(1).optional().messages({
        'number.base': 'Duration must be a number',
        'number.min': 'Duration must be greater than 0'
    }),
    status: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 or 1'
    })
});