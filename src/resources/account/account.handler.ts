import { NextFunction, Request, Response } from 'express'

import AccountService from '@resources/account/account.service'
import TransactionService from '@resources/transaction/transaction.service'

import { reqAsyncHandler } from '@utils/helpers/asyncHandler'

class AccountHandler {
  private service = AccountService

  /** Creates a new account. */
  public create = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Get user.
      req.body.user = req.user.id

      // Create account.
      const account = await this.service.create(req.body)

      res.status(201).send({
        ok: true,
        accountId: account._id,
      })
    }
  )

  /** Updates a new account. */
  public update = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Update account.
      const account = await this.service.update(req.params.id, req.body)

      res.status(201).send({
        ok: true,
        accountId: account._id,
      })
    }
  )

  /** Lists a user's accounts. */
  public list = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Get queries.
      const { limit, page, ...rest } = req.query

      // Set defaults.
      const skipLimit = limit && Number(limit) ? Number(limit) : 10
      const pageNo = page && Number(page) ? Number(page) - 1 : 0

      // Get accounts.
      const accounts = await this.service.list(
        { ...rest, user: req.user.id },
        skipLimit,
        pageNo
      )

      res.status(200).send({
        ok: true,
        accounts,
      })
    }
  )

  /** Gets a single account. */
  public get = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Get account.
      const account = await this.service.get(req.params.id)

      // Get account transactions.
      const transactions = await TransactionService.list({
        user: req.user.id,
        account: account._id
      })

      res.status(200).send({
        ok: true,
        account,
        transactions
      })
    }
  )

  /** Deletes account. */
  public remove = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Delete account.
      const account = await this.service.remove(req.params.id)

      // Delete account transactions.
      if (account) {
        await TransactionService.removeAll({ account: req.params.id })
      } 

      res.status(200).send({
        ok: true
      })
    }
  )

  /** Gets currencies of accounts. */
  public getCurrencies = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Get currencies.
      const currencies = await this.service.accountCurrencies(req.user.id)

      res.status(200).send({
        ok: true,
        currencies
      })
    }
  )

  
}

export default new AccountHandler()
