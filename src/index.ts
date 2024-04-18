import 'dotenv/config'
import 'module-alias/register' // Register module aliases.

import App from './app'

import validateEnv from '@utils/helpers/validateEnv'

import UserController from '@resources/user/user.controller'
import AuthController from '@resources/auth/auth.controller'
import TransactionController from '@resources/transaction/transaction.controller'
import AccountController from '@resources/account/account.controller'
import CategoryController from '@resources/category/category.controller'
import PropertyController from '@resources/property/property.controller'

validateEnv()

const app = new App(
  Number(process.env.PORT),
  [
    UserController,
    AuthController,
    TransactionController,
    AccountController,
    CategoryController,
    PropertyController,
  ]
)

app.start()
