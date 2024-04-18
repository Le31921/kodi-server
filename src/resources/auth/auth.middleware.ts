import { NextFunction, Request, Response } from 'express'

import User from '@resources/user/user.model'

import HttpException from '@utils/exceptions/http.exception'
import { generateTokenPayload } from '@utils/helpers/jwt'

class AuthMiddleware {
  private user = User

  /**
   * Verifies user credentials.
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public verifyCredentials = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = await this.user.findOne({ email: req.body.email })

    if (!user) {
      return next(new HttpException(404, 'No user with this email found.'))
    }

    if (!user.isVerified) {
      return next(
        new HttpException(400, 'Please verify your account and try again.')
      )
    }

    const isValid = await user.comparePassword(req.body.password)

    if (!isValid) {
      return next(new HttpException(401, 'Incorrect email or password.'))
    }

    req.body = generateTokenPayload(user)

    next()
  }
}

export default new AuthMiddleware()
