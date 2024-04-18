import Joi from "joi";

const create = Joi.object({
  name: Joi
  .string()
  .min(2)
  .max(30)
  .required()
  .messages({
    'any.required': 'Category name is required.',
    'string.empty': 'Category name cannot be empty.',
    'string.min': 'Category name must be at least 2 characters long.',
    'string.max': 'Category name cannot be more than 30 characters.'
  }),
})

export default {
  create
}