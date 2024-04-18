import Otp from "@resources/otp/otp.model";
import { IOtp, IVerifyOtp } from "@resources/otp/otp.interface";

import { serviceAsyncHandler } from "@utils/helpers/asyncHandler";

class OtpService {
  private model = Otp

  /**
   * Creates a new otp.
   * @param data 
   * @returns otp
   */
  public create = (data:  Partial<IOtp>): Promise<IOtp> =>
    serviceAsyncHandler(
      async () => {
        const otp = await this.model.create(data)
        return otp
      }
    )()
  
  /**
   * Deletes otp.
   * @param id 
   * @returns 
   */
  public remove = (id: string) =>
    serviceAsyncHandler(
      async () => {
        await this.model.findByIdAndDelete(id)
      }
    )()

  /**
   * Generates otp value
   * @param len 
   * @returns otp value
   */
  public generateOtp = (len: number): string => {
    let value = ''

    for (let i = 0; i < len; i++) {
      value += Math.floor(Math.random() * 10)
    }

    return value
  }

  /**
   * Checks validity of otp.
   * @param userId 
   * @param otpValue 
   * @returns true or false
   */
  public isValidOtp = ({
    userId,
    otpValue,
    cleanup
  }: IVerifyOtp): Promise<Boolean> =>
    serviceAsyncHandler(
      async () => {
        const otp = await this.model.findOne({
          user: userId,
          value: otpValue
        })

        if (!otp) return false

        if (otp.expiry < new Date()) return false

        if (cleanup) {
          await this.model.findByIdAndDelete(otp._id)
        }

        return true
      }
    )()

  /**
   * Creates new otp.
   * @param userId 
   * @returns OTP value
   */
  public newOtp = (userId: string): Promise<string> =>
    serviceAsyncHandler(
      async () => {
        const expiryDate = new Date()
        const otpExpiry = expiryDate.setHours(expiryDate.getHours() + 24)

        const otp = await this.create({
          user: userId,
          value: this.generateOtp(6),
          expiry: new Date(otpExpiry),
        })

        return otp.value
      }
    )()

  public verifyOtp = (email: string, otpValue: string) =>
    serviceAsyncHandler(
      async () => {
        
      }
    )()
}

export default new OtpService()