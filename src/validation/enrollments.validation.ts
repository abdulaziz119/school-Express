import Joi from 'joi';

export const enrollmentSchema = Joi.object({
    student_id: Joi.number()
        .required()
        .positive()
        .messages({
            'number.base': 'Student ID must be a number',
            'number.positive': 'Student ID must be positive',
            'any.required': 'Student ID is required'
        }),

    course_id: Joi.number()
        .required()
        .positive()
        .messages({
            'number.base': 'Course ID must be a number',
            'number.positive': 'Course ID must be positive',
            'any.required': 'Course ID is required'
        }),

    total_lessons: Joi.number()
        .optional()
        .min(1)
        .messages({
            'number.base': 'Total lessons must be a number',
            'number.min': 'Total lessons must be at least 1'
        }),

    status: Joi.number()
        .valid(0, 1)
        .default(1)
        .messages({
            'any.only': 'Status must be either 0 or 1'
        })
});

export const enrollmentQuerySchema = Joi.object({
    page: Joi.number()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'Page must be a number',
            'number.min': 'Page must be at least 1'
        }),

    limit: Joi.number()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.base': 'Limit must be a number',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit cannot exceed 100'
        }),

    status: Joi.number()
        .valid(0, 1)
        .optional()
        .messages({
            'any.only': 'Status must be either 0 or 1'
        }),

    student_id: Joi.number()
        .positive()
        .optional()
        .messages({
            'number.base': 'Student ID must be a number',
            'number.positive': 'Student ID must be positive'
        }),

    course_id: Joi.number()
        .positive()
        .optional()
        .messages({
            'number.base': 'Course ID must be a number',
            'number.positive': 'Course ID must be positive'
        })
});