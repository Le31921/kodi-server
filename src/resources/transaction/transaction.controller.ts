import { Router } from 'express'

import TransactionHandler from '@resources/transaction/transaction.handler'
import TransactionValidation from '@resources/transaction/transaction.validation'
import TransactionMiddleware from '@resources/transaction/transaction.middleware'

import IController from '@utils/interfaces/controller.interface'

import ensureAuthenticated from '@middleware/ensureAuthenticated.middlware'
import validationMiddleware from '@middleware/validation.middleware'

class TransactionController implements IController {
  path: string = '/transactions'
  router: Router = Router()

  private handler = TransactionHandler
  private validation = TransactionValidation

  constructor() {
    this.initRoutes()
  }

  private initRoutes = (): void => {
    /**
     * @desc Create a transaction.
     * @path /api/transactions
     * @method POST
     */
    this.router.post(
      this.path,
      ensureAuthenticated,
      validationMiddleware(this.validation.create),
      this.handler.create
    )
    
    /**
     * @desc List transactions.
     * @path /api/transactions
     * @method GET
     */
    this.router.get(
      this.path,
      ensureAuthenticated,
      this.handler.list
    )
    
    /**
     * @desc Get a single transaction.
     * @path /api/transactions/:id
     * @method GET
     */
    this.router.get(
      this.path + '/:id',
      ensureAuthenticated,
      TransactionMiddleware.ensureTransactionOwner,
      this.handler.get
    )

    /**
     * @desc Update a transaction.
     * @path /api/transactions/:id
     * @method PATCH
     */
    this.router.patch(
      this.path + '/:id',
      ensureAuthenticated,
      TransactionMiddleware.ensureTransactionOwner,
      validationMiddleware(this.validation.create),
      this.handler.update
    )

    /**
     * @desc Delete a transaction.
     * @path /api/transactions/:id
     * @method DELETE
     */
    this.router.delete(
      this.path + '/:id',
      ensureAuthenticated,
      TransactionMiddleware.ensureTransactionOwner,
      this.handler.remove
    )
  }
}

export default new TransactionController()
