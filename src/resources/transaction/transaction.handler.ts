import { NextFunction, Request, Response } from 'express'

import TransactionService from '@resources/transaction/transaction.service'
import AccountService from '@resources/account/account.service'

import { reqAsyncHandler } from '@utils/helpers/asyncHandler'
import HttpException from '@utils/exceptions/http.exception'
import isEmpty from '@utils/helpers/isEmpty'

class TransactionHandler {
  private service = TransactionService

  /** Creates a new transaction. */
  public create = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Add user.
      req.body.user = req.user.id

      // Delete refs if empty.
      if (isEmpty(req.body.category)) delete req.body.category
      if (isEmpty(req.body.account)) delete req.body.account

      // Ensure same currency.
      if (req.body.account) {
        const account = await AccountService.get(req.body.account)
        
        if (account.currency !== req.body.currency) {
          return next(new HttpException(400, 'Transaction and account have different currencies.'))
        }
      }

      // Create transaction.
      const transaction = await this.service.create(req.body)
      
      if (req.body.account && transaction) {
        // Update account balance.
        await AccountService.updateBalance({
          accountId: req.body.account,
          userId: req.user.id,
          amount: transaction.amount,
          transactionType: transaction.type
        })
      }

      res.status(201).send({
        ok: true,
        transactionId: transaction._id,
      })
    }
  )

  /** Update a transaction. */
  public update = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Delete refs if empty.
      if (isEmpty(req.body.category)) delete req.body.category
      if (isEmpty(req.body.account)) delete req.body.account

      // Ensure same currency.
      if (req.body.account) {
        const account = await AccountService.get(req.body.account)
        
        if (account.currency !== req.body.currency) {
          return next(new HttpException(
            400,
            'Transaction and the selected account have different currencies.'
          ))
        }
      }

      // Update transaction.
      const transaction = await this.service.update(req.params.id, req.body)

      if (transaction.account) {
        // Get account.
        const account = await AccountService.get(transaction.account.toString())

        if (transaction.account.toString() === req.body.account) {
          // Amount changed & transaction type unchanged.
          if (req.body.amount !== transaction.amount && req.body.type === transaction.type) {
            if (transaction.type === 'income') {
              account.balance -= transaction.amount // Remove old tx income amount.
              account.balance += req.body.amount // Add new tx income amount.
            } else {
              account.balance += transaction.amount // Add old tx expense amount.
              account.balance -= req.body.amount // Remove new tx expense amount.
            }
          }
  
          // Amount changed & transaction type changed.
          if (req.body.amount !== transaction.amount && req.body.type !== transaction.type) {
            if (transaction.type === 'income') {
              account.balance -= transaction.amount // Remove old tx income amount.
              account.balance -= req.body.amount // Remove new tx expense amount.
            } else {
              account.balance += transaction.amount // Add old tx expense amount.
              account.balance += req.body.amount // Add new tx income amount.
            }
          }
  
          // Amount unchanged & transaction type changed.
          if (req.body.amount === transaction.amount && req.body.type !== transaction.type) {
            if (transaction.type === 'income') {
              account.balance -= transaction.amount // Remove old tx income amount.
              account.balance -= transaction.amount // Remove new tx expense amount.
            } else {
              account.balance += transaction.amount // Add old tx expense amount.
              account.balance += transaction.amount // Add new tx income amount.
            }
          }

        } else {
          // Remove transaction from old account.
          if (transaction.type === 'income') {
            account.balance -= transaction.amount
          } else {
            account.balance += transaction.amount
          }

          // Add transaction to new account.
          await AccountService.updateBalance({
            accountId: req.body.account,
            userId: req.user.id,
            transactionType: req.body.type,
            amount: req.body.amount
          })
        }
        
        await account.save()
      }

      res.status(200).send({
        ok: true,
        transactionId: transaction._id,
      })
    }
  )

  /** Lists a user's transactions. */
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

      // Get transactions and count.
      const [transactions, totalTxCount] = await Promise.all([
        this.service.list(
          { ...rest, user: req.user.id },
          skipLimit,
          pageNo
        ),
        this.service.getCount({...rest, user: req.user.id})
      ])

      // Get stats.
      const stats = await this.service.stats(req.user.id)

      res.status(200).send({
        ok: true,
        items: transactions,
        stats,
        totalPageCount: Math.ceil(totalTxCount / skipLimit),
      })
    }
  )

  /** Gets a single transaction. */
  public get = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Get transaction.
      const transaction = await this.service.get(req.params.id)

      res.status(200).send({
        ok: true,
        transaction,
      })
    }
  )

  /** Deletes transaction. */
  public remove = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Delete transaction.
      const transaction = await this.service.remove(req.params.id)

      // Update account balance.
      if (transaction.account) {
        const account = await AccountService.get(transaction.account)

        if (transaction.type === 'income') {
          account.balance -= transaction.amount
        } else {
          account.balance += transaction.amount
        }

        await account.save()
      }

      res.status(200).send({
        ok: true
      })
    }
  )
}

export default new TransactionHandler()
