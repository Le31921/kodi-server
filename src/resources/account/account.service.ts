import mongoose, { FilterQuery } from 'mongoose'

import Account from '@resources/account/account.model'
import { IAccount, IAccountModel } from '@resources/account/account.interface'

import { serviceAsyncHandler } from '@utils/helpers/asyncHandler'

class AccountService {
  private model = Account

  /**
   * Creates account.
   * @param data 
   * @returns Promise<IAccount>
   */
  public create = (data: IAccount): Promise<IAccountModel> =>
    serviceAsyncHandler(
      async () => {
        const account = await this.model.create(data)
        return account
      }
    )()
  
  /**
   * Updates account.
   * @param data 
   * @returns Promise<IAccount>
   */
  public update = (id: string, data: IAccount): Promise<IAccountModel> =>
    serviceAsyncHandler(
      async () => {
        const account = await this.model.findByIdAndUpdate(id, data)
        return account
      }
    )()

  /**
   * Gets a single transaction using id.
   * @param id 
   * @returns Promise<IAccountModel>
   */
  public get = (id: string): Promise<IAccountModel> =>
    serviceAsyncHandler(
      async () => {
        const account = await this.model.findById(id)
        return account
      }
    )()

  /**
   * Lists transactions (with the specified criteria).
   * @param query 
   * @param limit 
   * @param page 
   * @param sort 
   * @returns Promise<IAccountModel[]>
   */
  public list = (
    query: FilterQuery<Partial<IAccount>> = {},
    limit: number = 10,
    page: number = 0,
    sort: any = { createdAt: -1 }
  ): Promise<IAccountModel[]> =>
    serviceAsyncHandler(
      async () => {
        const accounts = await this.model
          .find(query)
          .sort(sort)
          .limit(limit)
          .skip(page * limit)
        
        return accounts
      }
    )()
  
  /**
   * Updates account balance.
   * @param param0 
   * @returns Promise<IAccount>
   */
  public updateBalance = ({
    accountId,
    userId,
    transactionType,
    amount,
    isDelete
  }: {
    accountId: string,
    userId: string,
    transactionType: string,
    amount: number,
    isDelete?: boolean
  }): Promise<any> =>
    serviceAsyncHandler(
      async () => {
        if (transactionType === 'expense') amount = -amount

        const account = await this.model.findOne(
          { _id: accountId, user: userId }
        )
        
        if (account) {
          let newBalance = account.balance + amount
          if (newBalance < 0) newBalance = 0

          account.balance = newBalance

          await account.save()
        }
        return account
      }
    )()
  
  /**
   * Deletes an account.
   * @param id Account id
   * @returns 
   */
  public remove = (id: string) =>
    serviceAsyncHandler(
      async () => {
        const account = await this.model.findByIdAndRemove(id)
        return account
      }
    )()
  
  /**
   * Get currencies of accounts.
   * @param userId Account id
   * @returns 
   */
  public accountCurrencies = (userId: string) =>
    serviceAsyncHandler(
      async () => {
        let currencies = await this.model.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(userId)
            }
          },

          {
            $group: {
              _id: '$currency'
            }
          }
        ])

        return currencies
      }
    )()
}

export default new AccountService()
