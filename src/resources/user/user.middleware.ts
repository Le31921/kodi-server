import { NextFunction, Request, Response } from 'express'

import UserService from '@resources/user/user.service'

import HttpException from '@utils/exceptions/http.exception'

class UserMiddleware {
  // Ensure unique email.
  public ensureEmailNotExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = await UserService.getByEmail(req.body.email)
  
    if (user) {
      return next(
        new HttpException(400, 'The email provided is already registered.')
      )
    }
  
    next()
  }

  // Ensure it's the user or an admin.
  public ensureUserOrAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = await UserService.getById(req.params.id)

    if (req.user.id !== user?._id.toString() && req.user.permission !== 'ADMIN') {
      return next(
        new HttpException(401, "You're not authorized to perfom this action.")
      )
    }

    next()
  }

}

export default new UserMiddleware()