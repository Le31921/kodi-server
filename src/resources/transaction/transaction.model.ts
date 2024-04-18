import { Schema, model } from 'mongoose'

import { ITransactionModel } from '@resources/transaction/transaction.interface'

const TransactionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    amount: {
      type: Number,
      default: 0,
    },

    type: {
      type: String,
      enum: ['expense', 'income'],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },

    imgs: [String],

    // costs: [
    //   {
    //     title: String,
    //     amount: Number,
    //   },
    // ],

    cost: {
      type: Number,
      default: 0
    },

    grandTotal: {
      type: Number,
    },

    currency: {
      type: String,
      required: true
    },

    date: {
      type: Date
    }
  },
  { timestamps: true }
)

/**
 * Compute grand total.
 */
TransactionSchema.pre('save', function (next) {
  this.grandTotal = this.amount + this.cost
  return next()
})

export default model<ITransactionModel>('Transaction', TransactionSchema)
