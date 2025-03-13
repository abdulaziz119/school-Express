import * as Joi from 'joi'

const params_joi = Joi.object({
    limit: Joi.number().min(5).required(),
    page: Joi.number().min(1).required()
}).unknown(true);

const name_joi = Joi.object({
    name: Joi.string().required(),
}).unknown(true);

const id_joi = Joi.object({
    id: Joi.number().required()
}).unknown(true);

export {
    params_joi,
    name_joi,
    id_joi
}
