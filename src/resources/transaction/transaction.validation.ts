import Joi from 'joi'

const create = Joi.object({
  title: Joi
    .string()
    .required()
    .min(3)
    .max(256)
    .messages({
      'any.required': 'Transaction title is required.',
      'string.empty': 'Title cannot be empty.',
      'string.min': 'Title cannot be less than 3 characters.',
      'string.max': 'Title cannot be more than 256 characters.'
    }),

  amount: Joi
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
      'string.empty': 'Transaction type cannot be empty.',
      'any.required': 'Transaction type is required.'
    }),
  
  currency: Joi
    .string()
    .required()
    .messages({
      'string.empty': 'Transaction currency cannot be empty.',
      'any.required': 'Transaction currency is required.'
    }),
})

export default {
  create
}