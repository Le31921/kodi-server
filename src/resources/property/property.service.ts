import { FilterQuery } from "mongoose";

import PropertyModel from "@resources/property/property.model";
import { IProperty, IPropertyModel } from "@resources/property/property.interface";

import { serviceAsyncHandler } from "@utils/helpers/asyncHandler";

class PropertyService {
  private model = PropertyModel

  /**
   * Creates a new property.
   * @param data 
   * @returns property
   */
  public create = (data: IProperty): Promise<IPropertyModel> =>
    serviceAsyncHandler(
      async () => {
        const property = await this.model.create(data)
        return property
      }
    )()

  /**
   * Updates a property.
   * @param data 
   * @returns 
   */
  public update = (id: string, data: IProperty): Promise<IPropertyModel> =>
    serviceAsyncHandler(
      async () => {
        const property = await this.model.findByIdAndUpdate(id, data, { new: true })
        return property
      }
    )()

  /**
   * Gets a single property using id.
   * @param id 
   * @returns 
   */
  public get = (id: string): Promise<IPropertyModel> =>
    serviceAsyncHandler(
      async () => {
        const property = await this.model.findById(id).populate('category', 'name').populate("user", 'firstname email phone')
        return property
      }
    )()

  /**
   * Lists properties (with the specified criteria).
   * @param query 
   * @param limit 
   * @param page 
   * @param sort 
   * @returns 
   */
  public list = (
    query: FilterQuery<Partial<IProperty>> = {},
    limit: number = 10,
    page: number = 0,
    sort: any = { date: -1 }
  ): Promise<IPropertyModel[]> =>
    serviceAsyncHandler(
      async () => {
        const properties = await this.model
          .find(query)
          .populate('category', 'name slug')
          .sort(sort)
          .limit(limit)
          .skip(page * limit)
        
        return properties
      }
    )()

  /**
   * Deletes a property.
   * @param id property id
   * @returns 
   */
  public remove = (id: string) =>
    serviceAsyncHandler(
      async () => {
        const property = await this.model.findByIdAndRemove(id)
        return property
      }
    )()

  /**
   * Get property count.
   * @param query 
   * @returns 
   */
  public getCount = (query?: FilterQuery<Partial<IProperty>>) =>
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

export default new PropertyService()