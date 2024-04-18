import Joi from 'joi'

const create = Joi.object({
  name: Joi
    .string()
    .required()
    .min(3)
    .max(256)
    .messages({
      'any.required': 'Property name is required.',
      'string.empty': 'Name cannot be empty.',
      'string.min': 'Name cannot be less than 3 characters.',
      'string.max': 'Name cannot be more than 256 characters.'
    }),

  price: Joi
    .number()
    .precision(2)
    .positive()
    .required()
    .messages({
      'number.base': 'Transaction amount must be a number.',
      'number.positive': 'Transaction amount cannot be negative.',
      'any.required': 'Transaction amount is required.',
    }),

  type: Joi
    .string()
    .required()
    .messages({
      'string.empty': 'Property type cannot be empty.',
      'any.required': 'Property type is required.'
    }),
  
  description: Joi
    .string()
    .required()
    .messages({
      'string.empty': 'Property description cannot be empty.',
      'any.required': 'Property description is required.'
    }),
})

export default {
  create
}