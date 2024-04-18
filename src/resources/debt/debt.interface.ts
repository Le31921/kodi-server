import { Document, Schema } from 'mongoose'

export interface IDebt {
  title: string
  description: string
  amount: number
  dueDate: Date
  status: string
  creditor: IEntity | Schema.Types.ObjectId
  debtor: IEntity | Schema.Types.ObjectId
  currency: string
}

interface IEntity {
  user: Schema.Types.ObjectId | string
  name: string,
  phone: string,
  email: string
}

export interface IDebtModel extends IDebt, Document {}
