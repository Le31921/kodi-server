import mongoose, { FilterQuery } from 'mongoose'

import Transaction from '@resources/transaction/transaction.model'
import Account from '@resources/account/account.model'
import { ITransaction, ITransactionModel } from '@resources/transaction/transaction.interface'

import { serviceAsyncHandler } from '@utils/helpers/asyncHandler'

class TransactionService {
  private model = Transaction

  /**
   * Creates a new transaction.
   * @param data 
   * @returns 
   */
  public create = (data: ITransaction): Promise<ITransactionModel> =>
    serviceAsyncHandler(
      async () => {
        const transaction = await this.model.create(data)
        return transaction
      }
    )()

  /**
   * Updates a transaction.
   * @param data 
   * @returns 
   */
  public update = (id: string, data: ITransaction): Promise<ITransactionModel> =>
    serviceAsyncHandler(
      async () => {
        const transaction = await this.model.findByIdAndUpdate(id, data)
        return transaction
      }
    )()

  /**
   * Gets a single transaction using id.
   * @param id 
   * @returns 
   */
  public get = (id: string): Promise<ITransactionModel> =>
    serviceAsyncHandler(
      async () => {
        const transaction = await this.model.findById(id).populate('account', 'name number provider')
        return transaction
      }
    )()
  
  /**
   * Lists transactions (with the specified criteria).
   * @param query 
   * @param limit 
   * @param page 
   * @param sort 
   * @returns 
   */
  public list = (
    query: FilterQuery<Partial<ITransaction>> = {},
    limit: number = 10,
    page: number = 0,
    sort: any = { date: -1 }
  ): Promise<ITransactionModel[]> =>
    serviceAsyncHandler(
      async () => {
        const transactions = await this.model
          .find(query)
          .populate('category', 'name slug')
          .sort(sort)
          .limit(limit)
          .skip(page * limit)
        
        return transactions
      }
    )()
  
  /**
   * Get stats.
   * @param userId 
   * @returns 
   */
  public stats = (userId: string): Promise<any> =>
    serviceAsyncHandler(
      async () => {
        const stats = await this.model.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(userId)
            }
          },

          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' }
            }
          }
        ])

        const statsObjArr = stats.map((stat: any) => ({ [stat._id]: stat.total }))
        const statsObj = Object.assign({ income: 0, expense: 0, balance: 0 }, ...statsObjArr)

        const accounts = await Account.aggregate([
          {
            $match: { user: new mongoose.Types.ObjectId(userId) }
          },
          {
            $group: { _id: null, totalBalance: { $sum: '$balance' } }
          }
        ])

        if (accounts.length) {
          statsObj.balance = accounts[0].totalBalance
        }

        return statsObj
      }
    )()

  /**
   * Deletes a transaction.
   * @param id Transaction id
   * @returns 
   */
  public remove = (id: string) =>
    serviceAsyncHandler(
      async () => {
        const transaction = await this.model.findByIdAndRemove(id)
        return transaction
      }
    )()

  /**
   * Deletes transactions that meet the provided criteria.
   * @param query
   * @returns 
   */
  public removeAll = (query: FilterQuery<Partial<ITransaction>>) =>
    serviceAsyncHandler(
      async () => {
        return await this.model.deleteMany(query)
      }
    )()

  /**
   * Get transaction count.
   * @param query 
   * @returns 
   */
  public getCount = (query?: FilterQuery<Partial<ITransaction>>) =>
    serviceAsyncHandler(
      async () => {
        let count;
        
        if (query) {
          count = await this.model.countDocuments(query)
        } else {
          count = await this.model.estimatedDocumentCount()
        }

        return count
      }
    )()
}

export default new TransactionService()
