import { NextFunction, Request, Response } from 'express'

import Account from '@resources/account/account.model'

import HttpException from '@utils/exceptions/http.exception'

class AccountMiddleware {
  private account = Account

  public ensureAccountOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const account = await this.account.findById(req.params.id).select('user')

    if (!account) {
      return next(new HttpException(404, 'Account does not exist.'))
    }

    if (account.user.toString() !== req.user.id) {
      return next(new HttpException(401, 'You are not authorized to access this account.'))
    }

    next()
  }
}

export default new AccountMiddleware()
