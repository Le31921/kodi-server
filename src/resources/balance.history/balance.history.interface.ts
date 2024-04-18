import { Document, Schema } from "mongoose";

export interface IBalanceHistory {
  account: string | Schema.Types.ObjectId
  balance: number
}

export interface IBalanceHistoryModel extends IBalanceHistory, Document {}