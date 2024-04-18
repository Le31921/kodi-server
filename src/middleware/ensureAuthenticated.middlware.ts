import { NextFunction, Request, Response } from 'express'

import { verifyJwt } from '@utils/helpers/jwt'
import HttpException from '@utils/exceptions/http.exception'

const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.get('Authorization')
  
  if (!auth) {
    throw new HttpException(401, 'Log in to continue')
  }

  const [bearer, token] = auth.split(' ')
  
  if (bearer !== 'Bearer' || !token) {
    throw new HttpException(401, 'Invalid token. Log in to continue')
  }

  req.user = verifyJwt(token)
  
  next()
}

export default ensureAuthenticated
