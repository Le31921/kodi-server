import { Schema, model } from 'mongoose'

import { IDebtModel } from '@resources/debt/debt.interface'

const DebtSchema = new Schema(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: Date,
    },

    status: {
      type: String,
    },

    creditor: {
      name: String,
      email: String,
      phone: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
    },

    debtor: {
      name: String,
      email: String,
      phone: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
    },

    currency: {
      type: String
    }
  },
  { timestamps: true }
)

export default model<IDebtModel>('Debt', DebtSchema)
