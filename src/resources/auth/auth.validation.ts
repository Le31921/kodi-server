import Joi from 'joi'

/** Credentials validation. */
const credentials = Joi.object({
  email: Joi
    .string()
    .email()
    .required()
    .max(320)
    .messages({
      'any.required': 'Your email is required.',
      'string.empty': 'Your email cannot be empty.',
      'string.max': 'Your email cannot be more than 320 characters.',
    }),
  
  password: Joi
    .string()
    .max(128)
    .required()
    .messages({
      'any.required': 'Your password is required.',
      'string.empty': 'You must enter your password.',
      'string.max': 'Your password cannot be more than 128 characters.'
    }),
})

/** Forgot password validation. */
const forgotPassword = Joi.object({
  email: Joi
    .string()
    .email()
    .required()
    .max(320)
    .messages({
      'any.required': 'Your email is required.',
      'string.empty': 'Your email cannot be empty.',
      'string.max': 'Your email cannot be more than 320 characters.',
    }),
})

/** Reset password validation. */
const resetPassword = Joi.object({
  email: Joi
    .string()
    .email()
    .required()
    .max(320)
    .messages({
      'any.required': 'Your email is required.',
      'string.empty': 'Your email cannot be empty.',
      'string.max': 'Your email cannot be more than 320 characters.',
    }),
  
  otpValue: Joi
    .string()
    .required()
    .min(6)
    .max(6)
    .messages({
      'any.required': 'OTP value is required.',
      'string.empty': 'OTP value cannot be empty.',
      'string.min': 'OTP must be 6 characters long.',
      'string.max': 'OTP cannot be more than 6 characters long.'
    }),

  password: Joi
    .string()
    .max(128)
    .required()
    .messages({
      'any.required': 'Your password is required.',
      'string.empty': 'You must enter your password.',
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

export default {
  credentials,
  forgotPassword,
  resetPassword
}