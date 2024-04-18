import { cleanEnv, str, port } from 'envalid'

const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production'],
    }),
    MONGO_URI: str(),
    PORT: port({ default: 4000 }),
    JWT_SECRET: str(),
    MAIL_HOST: str(),
    MAIL_USER: str(),
    MAIL_PASSWORD: str(),
    MAIL_DISPLAY_NAME: str(),
    MAIL_PORT: port({ default: 465 }),
  })
}

export default validateEnv
