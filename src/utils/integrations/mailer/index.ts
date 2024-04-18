import { createTransport, Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

import { serviceAsyncHandler } from '@utils/helpers/asyncHandler'

class Mailer {
  private transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      // @ts-ignore
      pool: true,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    })
  }

  /**
   * Sends email.
   * @param data 
   * @returns 
   */
  public send = (data: Mail.Options): Promise<any> =>
    serviceAsyncHandler(
      async () => {
        const result = await this.transporter.sendMail({
          ...data,
          from: `"${process.env.MAIL_DISPLAY_NAME}" ${process.env.MAIL_USER}`
        })

        return result
      }
    )()
}

export default new Mailer()