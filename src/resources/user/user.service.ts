import mongoose, { FilterQuery } from 'mongoose'

import User from '@resources/user/user.model'
import Transaction from '@resources/transaction/transaction.model'
import Account from '@resources/account/account.model'
import { IUser } from '@resources/user/user.interface'

import { serviceAsyncHandler } from '@utils/helpers/asyncHandler'

class UserService {
  private model = User

  /**
   * Creates a new user.
   * @param data
   * @returns Promise<IUser>
   */
  public create = (data: IUser): Promise<IUser> =>
    serviceAsyncHandler(
      async () => {
        const user = await this.model.create(data)
        return user
      }
    )()

  /**
   * Gets a user by email.
   * @param email 
   * @returns User
   */
  public getByEmail = (email: string): Promise<IUser | null> =>
    serviceAsyncHandler(
      async() => {
        const user = await this.model.findOne({ email })
        return user
      }
    )()

  /**
   * Gets a user by id.
   * @param userId
   * @returns User
   */
  public getById = (userId: string): Promise<IUser | null> =>
    serviceAsyncHandler(
      async() => {
        const user = await this.model.findById(userId)
        return user
      }
    )()

  /**
   * Updates user with social authentication credentials.
   * @param data 
   * @returns User
   */
  public updateWithSocialAuth = (data: IUser): Promise<IUser> =>
    serviceAsyncHandler(
      async () => {
        const user = await this.model.findOneAndUpdate(
          { email: data.email },
          data,
          { upsert: true, new: true }
        )
        return user
      }
    )()

  /**
   * Checks if a user that meets the specified criteria exists.
   * @param query 
   * @returns 
   */
  public checkIfExists = (query: FilterQuery<Partial<IUser>>): Promise<boolean> =>
    serviceAsyncHandler(
      async () => {
        const user = await this.model.exists(query)
        return user ? true : false
      }
    )()
  
  /**
   * Gets user summary.
   * @param userId 
   * @returns 
   */
  public summary = (userId: string): Promise<any> =>
    serviceAsyncHandler(
      async () => {
        const recentTransactions = await Transaction
          .find({
            user: userId
          })
          .populate('category', 'name slug')
          .sort({ date: -1 })
          .limit(3)

        let spendingData = await Transaction
          .aggregate([
            {
              $match: {
                user: new mongoose.Types.ObjectId(userId),
              }
            },
            {
              $group: {
                _id: { $month: '$date' },
                income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$grandTotal', 0] } },
                expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$grandTotal', 0] } },
              }
            },
          ])

        spendingData = spendingData
          .sort((a, b) => a._id - b._id)
          .map(item => ({
            month: new Date(Date.UTC(2023, item._id - 1, 1)).toLocaleString('default', { month: 'long' }),
            income: item.income,
            expense: item.expense
          }))
        

        return {
          recentTransactions,
          spendingData,
        }
      }
    )()
  
  /**
   * Gets user money summary.
   * @param userId
   * @param currency
   * @returns 
   */
  public moneyStats = ({
    userId,
    currency
  }: {
    userId: string,
    currency: string
  }): Promise<any> =>
    serviceAsyncHandler(
      async () => {
        let txTotals = await Transaction.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(userId),
              currency
            }
          },
          {
            $group: {
              _id: '$type',
              total: { $sum: '$grandTotal' }
            }
          }
        ])

        txTotals = txTotals.map(item => ({ [item._id]: item.total }))
        txTotals = Object.assign({ income: 0, expense: 0}, ...txTotals)

        const accounts = await Account.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(userId),
              currency
            }
          },
          {
            $lookup: {
              from: 'transactions',
              as: 'transactions',
              localField: '_id',
              foreignField: 'account'
            }
          },
          {
            $project: {
              _id: 0,
              name: 1,
              balance: 1,
              transactions: {
                $reduce: {
                  input: '$transactions',
                  initialValue: { income: 0, expense: 0 },
                  in: {
                    income: {
                      $add: [
                        '$$value.income',
                        { $cond: [{ $eq: ['$$this.type', 'income'] }, '$$this.grandTotal', 0] }
                      ]
                    },
                    expense: {
                      $add: [
                        '$$value.expense',
                        { $cond: [{ $eq: ['$$this.type', 'expense'] }, '$$this.grandTotal', 0] }
                      ]
                    },
                  }
                }
              }
            }
          }
        ])

        const totalAccountsBalance = accounts.reduce((balance, account) => balance + account.balance, 0)
        console.log('txtotals', txTotals)

        return {
          txTotals,
          accounts,
          totalAccountsBalance
        }
      }
    )()
  
  
  /**
   * Get user currencies.
   * @param userId 
   * @returns 
   */
  public getCurrencies = (userId: string): Promise<Partial<IUser>> =>
    serviceAsyncHandler(
      async () => {
        const user = await this.model.findById(userId)
          .select('defaultCurrency currencies -_id')

        return user
      }
    )()

  /**
   * Update user.
   * @param userId
   * @param data
   * @returns user
   */
  public updateUser = ({
    userId,
    data
  }: {
    userId: string
    data: Partial<IUser>
  }): Promise<IUser> =>
    serviceAsyncHandler(
      async () => {
        const user = await this.model.findByIdAndUpdate(userId, data)
        return user
      }
    )()
}

export default new UserService()