import Joi from "joi";

export const updateProgressSchema = Joi.object({
    enrollment_id: Joi.number()
        .required()
        .positive()
        .messages({
            'number.base': 'Enrollment ID must be a number',
            'number.positive': 'Enrollment ID must be positive',
            'any.required': 'Enrollment ID is required'
        }),

    completed_lessons: Joi.number()
        .required()
        .min(0)
        .messages({
            'number.base': 'Completed lessons must be a number',
            'number.min': 'Completed lessons cannot be negative',
            'any.required': 'Completed lessons is required'
        })
});