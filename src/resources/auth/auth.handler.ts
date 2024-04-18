import { NextFunction, Request, Response } from 'express'

import AuthTemplate from '@resources/auth/auth.template'
import UserService from '@resources/user/user.service'
import OtpService from '@resources/otp/otp.service'

import HttpException from '@utils/exceptions/http.exception'
import Mailer from '@utils/integrations/mailer'
import { reqAsyncHandler } from '@utils/helpers/asyncHandler'
import { signJwt } from '@utils/helpers/jwt'

class AuthHandler {
  private userService = UserService
  private otpService = OtpService

  /** Logs in a user. */
  public login = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Get token.
      const accessToken = signJwt(req.body)

      res.status(200).send({
        accessToken,
        ok: true
      })
    }
  )

  /** Forgot password. */
  public forgotPassword = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Try getting user.
      const user = await this.userService.getByEmail(req.body.email)

      if (!user) {
        return next(new HttpException(404, 'User with this email not found.'))
      }

      // Generate otp.
      const otp = await this.otpService.newOtp(user._id)

      // Send email.
      await Mailer.send({
        to: user.email,
        subject: 'Confirm Verification Code',
        html: AuthTemplate.forgotPassword({
          otp,
          name: user.firstname
        })
      })

      res.status(200).send({
        ok: true,
        message: ''
      })
    }
  )

  /** Verify forgot password. */
  public verifyForgotPassword = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Try getting user.
      const user = await this.userService.getByEmail(req.body.email)

      if (!user) {
        return next(new HttpException(404, 'The email is not registered.'))
      }

      // Validate OTP.
      const isValidOtp = await this.otpService.isValidOtp({
        userId: user._id,
        otpValue: req.body.otpValue
      })

      if (!isValidOtp) {
        return next(new HttpException(
          400,
          'The OTP entered is incorrect or has expired. Please try again or generate a new one.'
        ))
      }

      res.status(200).send({
        ok: true
      })
    }
  )

  /** Reset password. */
  public resetPassword = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Try getting user.
      const user = await this.userService.getByEmail(req.body.email)

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

      // Update password.
      user.password = req.body.password
      await user.save()

      res.status(200).send({
        ok: true,
        message: 'Password reset successfully.'
      })
    }
  )
}

export default new AuthHandler()
