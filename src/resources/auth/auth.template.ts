import { IOtpName } from '@utils/interfaces'

class AuthTemplate {
  public forgotPassword = (data: IOtpName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet">
        <title>Verify Email</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
      
          body {
            background: #f0f0f0;
            font-family: 'Sora', sans-serif;
          }
      
          .container {
            background: #fff;
            max-width: 600px;
            width: 100%;
            padding: 30px;
            margin: 0 auto;
          }
      
          .content h1, .email p {
            margin-bottom: 25px;
          }
      
          .email p {
            line-height: 150%;
            font-size: 17px;
            color: #333;
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
            <h1>Confirm Verification Code</h1>
      
            <div class="email">
              <p>Hey ${data.name},</p>
              <p>Here's your verification code:</p>
              <p class="otp">${data.otp}</p>
              <p>This code will expire in <strong>15 minutes</strong>. If you have any questions or need assistance with the verification process, please contact our support team at <strong>support@fyntrax.com</strong>.</p>
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

export default new AuthTemplate()
