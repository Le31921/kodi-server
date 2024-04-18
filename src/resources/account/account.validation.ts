import Joi from 'joi'

const create = Joi.object({
  name: Joi
    .string()
    .required()
    .min(3)
    .max(256)
    .messages({
      'any.required': 'Account name is required.',
      'string.empty': 'Account name cannot be empty.',
      'string.min': 'Account name must be at least 3 characters.',
      'string.max': 'Account name cannot be more than 256 characters.',
    }),
  
  balance: Joi
    .number()
    .precision(2)
    .min(0)
    .required()
    .messages({
      'any.required': 'Account balance is required.',
      'number.base': 'Account balance must be a number.',
      'number.positive': 'Account balance must be a positive number or 0.',
    }),

  currency: Joi
    .string()
    .required()
    .messages({
      'any.required': 'Account currency is required.',
      'string.empty': 'Account currency cannot be empty.'
    })
})

export default {
  create
}