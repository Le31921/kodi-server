import { Request, Response, NextFunction, RequestHandler } from 'express'
import Joi from 'joi'

const validationMiddleware = (schema: Joi.Schema): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const validationOptions: Joi.ValidationOptions = {
      abortEarly: false,
      allowUnknown: true,
    }

    try {
      const value = await schema.validateAsync(req.body, validationOptions)
      req.body = value

      next()
    } catch (e: any) {
      const errors = {}
      e.details.forEach((err: Joi.ValidationErrorItem) => {
        // @ts-ignore
        errors[err.context?.key] = err.message
        console.log(err)
      })

      res.status(400).send({
        errors,
        ok: false,
      })
    }
  }
}

export default validationMiddleware
