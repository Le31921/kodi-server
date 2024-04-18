import { Router } from 'express'

import AccountHandler from '@resources/account/account.handler'
import AccountValidation from '@resources/account/account.validation'
import AccountMiddleware from '@resources/account/account.middleware'

import IController from '@utils/interfaces/controller.interface'

import ensureAuthenticated from '@middleware/ensureAuthenticated.middlware'
import validationMiddleware from '@middleware/validation.middleware'

class AccountController implements IController {
  path: string = '/accounts'
  router: Router = Router()

  private handler = AccountHandler
  private validation = AccountValidation

  constructor() {
    this.initRoutes()
  }

  private initRoutes = (): void => {
    /**
     * @desc Create an account.
     * @path /api/accounts
     * @method POST
     */
    this.router.post(
      this.path,
      ensureAuthenticated,
      validationMiddleware(this.validation.create),
      this.handler.create
    )
    
    /**
     * @desc Update an account.
     * @path /api/accounts/:id
     * @method PATCH
     */
    this.router.patch(
      this.path + '/:id',
      ensureAuthenticated,
      AccountMiddleware.ensureAccountOwner,
      validationMiddleware(this.validation.create),
      this.handler.update
    )
    
    /**
     * @desc List accounts.
     * @path /api/accounts
     * @method GET
     */
    this.router.get(
      this.path,
      ensureAuthenticated,
      this.handler.list
    )

    /**
     * @desc Get account currencies.
     * @path /api/accounts/currencies
     * @method GET
     */
    this.router.get(
      this.path + '/currencies',
      ensureAuthenticated,
      this.handler.getCurrencies
    )
    
    /**
     * @desc Get a single account.
     * @path /api/accounts/:id
     * @method GET
     */
    this.router.get(
      this.path + '/:id',
      ensureAuthenticated,
      AccountMiddleware.ensureAccountOwner,
      this.handler.get
    )
    
    /**
     * @desc Delete account.
     * @path /api/accounts/:id
     * @method DELETE
     */
    this.router.delete(
      this.path + '/:id',
      ensureAuthenticated,
      AccountMiddleware.ensureAccountOwner,
      this.handler.remove
    )
    
  }
}

export default new AccountController()
