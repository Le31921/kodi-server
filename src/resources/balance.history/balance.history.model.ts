import { Schema, model } from 'mongoose'

import { IBalanceHistory } from '@resources/balance.history/balance.history.interface'

const BalanceHistorySchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },

    balance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

export default model<IBalanceHistory>('Balance', BalanceHistorySchema)
