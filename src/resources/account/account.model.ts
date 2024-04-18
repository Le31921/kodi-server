import { Schema, model } from 'mongoose'

import { IAccountModel } from '@resources/account/account.interface'
import BalanceHistoryService from '@resources/balance.history/balance.history.service'

const AccountSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
  },

  number: {
    type: String,
  },

  balance: {
    type: Number
  },

  provider: {
    type: String
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  currency: {
    type: String
  },
  
  type: {
    type: String
  },

  collaborators: [
    { user: String }
  ]
})

// Reset balance to 0 if it goes below.
AccountSchema.pre('save', async function (next) {
  if (this.balance && this.balance < 0) this.balance = 0

  if (this.isNew || this.isModified('balance')) {
    await BalanceHistoryService.add({
      // @ts-ignore
      account: this._id,
      balance: this.balance as number
    })
  }
  return next()
})

export default model<IAccountModel>('Account', AccountSchema)
