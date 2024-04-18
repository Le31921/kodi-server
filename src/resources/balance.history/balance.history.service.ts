import { FilterQuery } from 'mongoose'

import BalanceHistory from '@resources/balance.history/balance.history.model'
import {
  IBalanceHistory,
  IBalanceHistoryModel,
} from '@resources/balance.history/balance.history.interface'

import { serviceAsyncHandler } from '@utils/helpers/asyncHandler'

class BalanceHistoryService {
  private model = BalanceHistory

  /**
   * Adds balance record.
   * @param data
   * @returns
   */
  public add = (data: IBalanceHistory) =>
    serviceAsyncHandler(async () => {
      const record = await this.model.create(data)
      return record
    })()

  /**
   * Lists balance history records (with the specified criteria).
   * @param query
   * @param limit
   * @param page
   * @param sort
   * @returns
   */
  public list = (
    query: FilterQuery<Partial<IBalanceHistory>> = {},
    limit: number = 10,
    page: number = 0,
    sort: any = { createdAt: -1 }
  ): Promise<IBalanceHistoryModel[]> =>
    serviceAsyncHandler(async () => {
      const records = await this.model
        .find(query)
        .sort(sort)
        .limit(limit)
        .skip(page * limit)

      return records
    })()

  /**
   * Deletes all balance records.
   * @param account
   * @returns
   */
  public removeAll = (account: string) =>
    serviceAsyncHandler(async () => {
      return await this.model.deleteMany({ account })
    })()
}

export default new BalanceHistoryService()
