import { FilterQuery } from "mongoose";

import { serviceAsyncHandler } from "@utils/helpers/asyncHandler";

import Category from "@resources/category/category.model";
import { ICategory } from "@resources/category/category.interface";

class CategoryService {
  private model = Category

  /**
   * Create category.
   * @param data 
   * @returns 
   */
  public create = (data: ICategory): Promise<ICategory> =>
    serviceAsyncHandler(async () => {
      const category = await this.model.create(data)
      return category
    })()
  
  /**
   * Create many categories.
   * @param data 
   * @returns 
   */
  public createMany = (data: Partial<ICategory>[]): Promise<ICategory[]> =>
    serviceAsyncHandler(async () => {
      const categories = await this.model.insertMany(data)
      return categories
    })()

  /**
   * List categories.
   * @param query 
   * @param limit 
   * @param page 
   * @param sort 
   * @returns 
   */
  public list = (
    query: FilterQuery<Partial<ICategory>> = {},
    limit: number = 10,
    page: number = 0,
    sort: any = { name: 1 }
  ): Promise<ICategory[]> =>
    serviceAsyncHandler(async () => {
      const categories = await this.model
        .find(query)
        .sort(sort)
        .limit(limit)
        .skip(limit * page)

      return categories
    })()

  /**
   * Get category by slug.
   * @param slug 
   * @returns 
   */
  public getBySlug = (slug: string) =>
    serviceAsyncHandler(async () => {
      const category = this.model.aggregate([
        {
          $match: {
            slug
          }
        },

        {
          $lookup: {
            from: 'categories',
            let: { ancestorId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$ancestor', '$$ancestorId'] } 
                }
              },
              {
                $project: {
                  _id: 0,
                  name: 1,
                  slug: 1
                }
              }
            ],
            // localField: '_id',
            // foreignField: 'ancestor',
            as: 'subcategories',
          }
        }
      ])

      return category
    })()

  /**
   * Get category count.
   * @param query 
   * @returns 
   */
  public getCount = (query?: FilterQuery<Partial<ICategory>>) =>
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

export default new CategoryService()