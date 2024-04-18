import { Schema, model } from 'mongoose'

import { IOtp } from '@resources/otp/otp.interface'

const OtpSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    value: {
      type: String,
    },

    expiry: {
      type: Date,
    },
  },
  { timestamps: true }
)

export default model<IOtp>('Otp', OtpSchema)
