import { NextFunction, Request, Response } from 'express'

import UserService from '@resources/user/user.service'
import UserTemplate from '@resources/user/user.template'
import OtpService from '@resources/otp/otp.service'
import TransactionService from '@resources/transaction/transaction.service'

import Mailer from '@utils/integrations/mailer'
import { reqAsyncHandler } from '@utils/helpers/asyncHandler'
import { generateTokenPayload, signJwt } from '@utils/helpers/jwt'
import HttpException from '@utils/exceptions/http.exception'

class UserHandler {
  private service = UserService
  private otpService = OtpService

  /** Creates user with email & password. */
  public createWithCredentials = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Create user.
      const user = await this.service.create(req.body)

      // Generate otp.
      const otp = await this.otpService.newOtp(user._id)

      // Send verification email.
      await Mailer.send({
        to: user.email,
        subject: 'Verify Your Fyntrax Account',
        html: UserTemplate.verifyEmail({
          otp,
          name: user.firstname
        })
      })

      res.status(201).send({
        user,
        ok: true,
      })
    }
  )

  /** Creates user with Google. */
  public createWithGoogle = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const user = await this.service.updateWithSocialAuth(req.body)

      // Generate payload.
      const payload = generateTokenPayload(user)

      // Get access token.
      const accessToken = signJwt(payload)

      res.status(201).send({
        accessToken,
        ok: true,
      })
    }
  )

  /** Verify email */
  public verifyEmail = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Try getting user.
      const user = await this.service.getByEmail(req.body.email)

      if (!user) {
        return next(new HttpException(404, 'The email is not registered.'))
      }

      // Validate OTP.
      const isValidOtp = await this.otpService.isValidOtp({
        userId: user._id,
        otpValue: req.body.otpValue,
        cleanup: true
      })

      if (!isValidOtp) {
        return next(new HttpException(
          400,
          'The OTP entered is incorrect or has expired. Please try again or generate a new one.'
        ))
      }

      // Update user.
      user.isVerified = true
      await user.save()

      res.status(200).send({
        ok: true,
        message: 'Email verified successfully.'
      })
    }
  )

  /** Get user's summary. */
  public getSummary = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const summary = await this.service.summary(req.user.id)

      res.status(200).send({
        ok: true,
        summary
      })
    }
  )

  /** Get user's money stats. */
  public getMoneyStats = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const stats = await this.service.moneyStats({
        userId: req.user.id,
        currency: req.query.currency as string
      })

      res.status(200).send({
        ok: true,
        stats
      })
    }
  )

  /** Get user's currencies. */
  public getCurrencies = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const user = await this.service.getCurrencies(req.params.id)

      res.status(200).send({
        ok: true,
        defaultCurrency: user.defaultCurrency,
        currencies: user.currencies
      })
    }
  )

  /** Get user by id. */
  public getById = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const user = await this.service.getById(req.params.id)

      if (!user) next(new HttpException(404, 'User does not exist'))

      res.status(200).send({
        ok: true,
        user
      })
    }
  )

  /** Update a user. */
  public update = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const user = await this.service.updateUser({
        userId: req.params.id,
        data: req.body
      })

      if (!user) {
        return next(new HttpException(404, 'User does not exist.'))
      }

      res.status(200).send({
        ok: true
      })
    }
  )
}

export default new UserHandler()
