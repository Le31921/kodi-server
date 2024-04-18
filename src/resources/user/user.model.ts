import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

import { IUser } from '@resources/user/user.interface'

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },

    username: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true
    },

    phone: {
      type: String,
    },

    password: {
      type: String,
    },

    image: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isSubscribed: {
      type: Boolean,
      default: true,
    },

    permission: {
      type: String,
      default: 'NORMAL',
      enum: ['NORMAL', 'PAID', 'ADMIN']
    },

    provider: {
      type: String,
      default: 'credentials'
    },

    paymentMethods: [
      {
        name: String,
        type: String,
        cardNo: Number,
        cvv: Number,
        phone: String,
        expiry: {
          month: Number,
          year: Number
        },
        isDefault: Boolean
      }
    ],

    currencies: [
      {
        type: String
      }
    ],

    objectives: [
      {
        type: String
      }
    ],

    defaultCurrency: {
      type: String,
    },

    isOnboarded: {
      type: Boolean,
      default: false
    },

    onboardingStatus: {
      type: String,
      enum: ['complete', 'incomplete', 'skipped'],
      default: 'incomplete'
    }
  },
  { timestamps: true }
)

/**
 * Hash password.
 */
UserSchema.pre('save', async function (next) {
  // Skip hash if password is unchanged.
  if (!this.isModified('password')) {
    return next()
  }

  // Generate salt and hash.
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hashSync(this.password as string, salt)

  // Replace password.
  this.password = hash

  return next()
})


/**
 * Compare password helper method.
 */
UserSchema.methods.comparePassword = async function (
  value: string
): Promise<boolean> {
  return bcrypt
    .compare(value, (this as IUser).password as string)
    .catch(e => false)
}

/**
 * Sanitize user.
 */
UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password
    return ret
  }
})

export default model<IUser>('User', UserSchema)
