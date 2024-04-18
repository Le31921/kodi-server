import { NextFunction, Request, Response } from 'express'

import Transaction from '@resources/transaction/transaction.model'

import HttpException from '@utils/exceptions/http.exception'

class TransactionMiddleware {
  private transaction = Transaction

  public ensureTransactionOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const transaction = await this.transaction.findById(req.params.id).select('user')

    if (!transaction) {
      return next(new HttpException(404, 'Transaction does not exist.'))
    }

    if (transaction.user.toString() !== req.user.id) {
      return next(new HttpException(401, 'You are not authorized to access this transaction.'))
    }

    next()
  }
}

export default new TransactionMiddleware()
