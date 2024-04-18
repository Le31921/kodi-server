import { IOtpName } from '@utils/interfaces'

class UserMailTemplate {
  public verifyEmail = (data: IOtpName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
      
          body {
            background: #f0f0f0;
            font-family: Figtree, sans-serif;
          }
      
          .container {
            background: #fff;
            max-width: 600px;
            width: 100%;
            padding: 25px;
            margin: 0 auto;
          }
      
          .content h1, .email p {
            margin-bottom: 20px;
          }
      
          .email p {
            line-height: 150%;
            font-size: 17px;
          }
      
          .email .otp {
            font-size: 30px;
            color: blue;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h1>Welcome ${data.name},</h1>
      
            <div class="email">
              <p>We're glad to have you onboard!</p>
              <p>To verify your email address and access all of our app's features, please use the following one-time password:</p>
              <p class="otp">${data.otp}</p>
              <p>This code will expire in <strong>24 hours</strong>. If you have any questions or need assistance with the verification process, please contact our support team at <strong>support@fyntrax.com</strong>.</p>
              <p>Thank you for choosing Fyntrax for your financial management needs.</p>
              <p>Best,<br>Fyntax Team.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

export default new UserMailTemplate()
