import { Document, Schema } from 'mongoose'

export interface IAccount {
  user: string | Schema.Types.ObjectId
  name: string
  description?: string
  number?: string
  provider?: string
  currency: string
  type?: string
  balance: number,
  collaborators: string[]
}

export interface IAccountModel extends IAccount, Document {}
