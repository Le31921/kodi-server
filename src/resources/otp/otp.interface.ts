import { Document, Schema } from "mongoose";

export interface IOtp extends Document {
  user: Schema.Types.ObjectId | string,
  value: string,
  expiry: Date
}

export interface IVerifyOtp {
  userId: string,
  otpValue: string,
  cleanup?: boolean
}