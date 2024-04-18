import { Schema, Document } from 'mongoose'

export interface ITransaction {
  title: string
  description?: string
  amount: number
  type: string
  category?: string | Schema.Types.ObjectId
  user: string | Schema.Types.ObjectId
  imgs?: string[]
  cost?: number
  account?: string | Schema.Types.ObjectId
  currency: string
  date: Date
  grandTotal: number
}

// @todo: Might add this later on, if users need it.
interface ICost {
  title: string
  amount: number
}

export interface ITransactionModel extends ITransaction, Document {}
