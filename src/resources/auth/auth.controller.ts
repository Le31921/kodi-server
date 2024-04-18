import { Router } from 'express'

import AuthMiddleware from '@resources/auth/auth.middleware'
import AuthHandler from '@resources/auth/auth.handler'
import AuthValidation from '@resources/auth/auth.validation'

import IController from '@utils/interfaces/controller.interface'

import validationMiddleware from '@middleware/validation.middleware'

class AuthController implements IController {
  path: string = '/auth'
  router: Router = Router()

  private middleware = AuthMiddleware
  private handler = AuthHandler
  private validation = AuthValidation

  constructor() {
    this.initRoutes()
  }

  private initRoutes = (): void => {
    /**
     * @desc Login a user with credentials.
     * @path /api/auth/login
     * @method POST
     */
    this.router.post(
      this.path + '/login',
      validationMiddleware(this.validation.credentials),
      this.middleware.verifyCredentials,
      this.handler.login
    )
    
    /**
     * @desc Forgot passwod.
     * @path /api/auth/forgot-password
     * @method POST
     */
    this.router.post(
      this.path + '/forgot-password',
      validationMiddleware(this.validation.forgotPassword),
      this.handler.forgotPassword
    )
    
    /**
     * @desc Forgot passwod.
     * @path /api/auth/reset-password
     * @method POST
     */
    this.router.post(
      this.path + '/reset-password',
      validationMiddleware(this.validation.resetPassword),
      this.handler.resetPassword
    )
  }
}

export default new AuthController()
