import { Document } from 'mongoose'

export interface IUser extends Document {
  firstname: string,
  lastname: string,
  username?: string,
  email: string,
  phone?: string,
  password?: string,
  image?: string,
  isVerified: boolean,
  isSubscribed: boolean,
  permission: string,
  provider: string,
  comparePassword: (value: string) => Promise<boolean>,
  paymentMethods: Array<IPaymentMethod>,
  currencies: string[],
  objectives: string[],
  defaultCurrency: string,
  isOnboarded: boolean,
  onboardingStatus: string
}

interface IPaymentMethod {
  name: string,
  type: string,
  cardNo?: number,
  cvv?: number,
  phone?: string,
  expiry?: {
    month: number,
    year: number
  },
  isDefault: boolean
}