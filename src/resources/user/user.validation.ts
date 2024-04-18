import Joi from 'joi'

/**
 * Create user validation.
 */
const create = Joi.object({
  firstname: Joi
    .string()
    .min(2)
    .max(30)
    .required()
    .messages({
      'any.required': 'Your first name is required.',
      'string.empty': 'Your first name cannot be empty.',
      'string.min': 'Your first name must be at least 2 characters long.',
      'string.max': 'Your first name cannot be more than 30 characters.'
    }),
  
  lastname: Joi
    .string()
    .min(2)
    .max(30)
    .required()
    .messages({
      'any.required': 'Your last name is required.',
      'string.empty': 'Your last name cannot be empty.',
      'string.min': 'Your last name must be at least 2 characters long.',
      'string.max': 'Your last name cannot be more than 30 characters.'
    }),
  
  email: Joi
    .string()
    .email()
    .required()
    .max(64)
    .messages({
      'any.required': 'Your email is required.',
      'string.empty': 'Your email cannot be empty.'
    }),
  
  password: Joi
    .string()
    .required()
    .min(8)
    .max(128)
    .messages({
      'any.required': 'You must set a password.',
      'string.empty': 'You must set a password.',
      'string.min': 'Your password must be at least 8 characters long.',
      'string.max': 'Your password cannot be more than 128 characters.'
    }),
  
  passwordConfirm: Joi
    .string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.required': 'You must confirm your password.',
      'string.empty': 'You must confirm your password.'
    }),
})

/**
 * Verify email validation.
 */
const verifyEmail = Joi.object({
  // email: Joi
  //   .string()
  //   .email()
  //   .required()
  //   .max(64)
  //   .messages({
  //     'any.required': 'Your email is required.',
  //     'string.empty': 'Your email cannot be empty.'
  //   }),
  
  otpValue: Joi
    .string()
    .required()
    .max(6)
    .messages({
      'any.required': 'You must enter the OTP.',
      'string.empty': 'OTP cannot be empty.',
      'string.max': 'OTP cannot be more than 6 digits.',
    })
})

export default {
  create,
  verifyEmail
}
