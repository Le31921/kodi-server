import { Router } from 'express'

import UserHandler from '@resources/user/user.handler'
import UserValidation from '@resources/user/user.validation'
import UserMiddleware from '@resources/user/user.middleware'

import IController from '@utils/interfaces/controller.interface'

import validationMiddleware from '@middleware/validation.middleware'
import ensureAuthenticated from '@middleware/ensureAuthenticated.middlware'

class UserController implements IController {
  path = '/users'
  router = Router()

  private handler = UserHandler
  private middleware = UserMiddleware
  private validation = UserValidation

  constructor() {
    this.initRoutes()
  }

  /** Initialize routes. */
  private initRoutes = (): void => {
    /**
     * @desc Create a user with credentials.
     * @path /api/users
     * @method POST
     */
    this.router.post(
      this.path,
      validationMiddleware(this.validation.create),
      this.middleware.ensureEmailNotExists,
      this.handler.createWithCredentials
    )
    
    /**
     * @desc Create a user with Google.
     * @path /api/users/google
     * @method POST
     */
    this.router.post(
      this.path + '/google',
      this.handler.createWithGoogle
    )
    
    /**
     * @desc Verify user account..
     * @path /api/users/verify
     * @method POST
     */
    this.router.post(
      this.path + '/verify',
      validationMiddleware(this.validation.verifyEmail),
      this.handler.verifyEmail
    )
    
    /**
     * @desc Get user summary.
     * @path /api/users/summary
     * @method GET
     */
    this.router.get(
      this.path + '/summary',
      ensureAuthenticated,
      this.handler.getSummary
    )
    
    /**
     * @desc Get user money stats.
     * @path /api/users/money-stats
     * @method GET
     */
    this.router.get(
      this.path + '/money-stats',
      ensureAuthenticated,
      this.handler.getMoneyStats
    )
    
    /**
     * @desc Get user by id.
     * @path /api/users/:id
     * @method GET
     */
    this.router.get(
      this.path + '/:id',
      ensureAuthenticated,
      this.handler.getById
    )
    
    /**
     * @desc Get user currencies.
     * @path /api/users/:id/currencies
     * @method GET
     */
    this.router.get(
      this.path + '/:id/currencies',
      ensureAuthenticated,
      this.middleware.ensureUserOrAdmin,
      this.handler.getCurrencies
    )
    
    /**
     * @desc Update a user.
     * @path /api/users/:id
     * @method PATCH
     */
    this.router.patch(
      this.path + '/:id',
      ensureAuthenticated,
      this.middleware.ensureUserOrAdmin,
      this.handler.update
    )
  }
}

export default new UserController()
