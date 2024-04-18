import { NextFunction, Request, RequestHandler, Response } from 'express'

import HttpException from '@utils/exceptions/http.exception'

export const reqAsyncHandler = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (e: any) {
      next(new HttpException(400, e.message))
    }
  }
}

export const serviceAsyncHandler = (fn: Function) => {
  return async () => {
    try {
      return await fn()
    } catch (e: any) {
      throw new HttpException(400, e.message)
    }
  }
}
