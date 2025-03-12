import Joi from 'joi';

const languageSchema = Joi.object({
    uz: Joi.string().required().messages({
        'string.empty': 'Uzbek title is required',
        'any.required': 'Uzbek title is required'
    }),
    ru: Joi.string().optional(),
    en: Joi.string().optional()
});

export const CourseSchema = Joi.object({
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