import { NextFunction, Request, Response } from 'express'

import HttpException from '@utils/exceptions/http.exception'

const errorMiddleware = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const status = err.status || 500
  const message = err.message || 'An error occurred.'

  return res.status(status).send({
    message,
    ok: false,
    status
  })
}

export default errorMiddleware
