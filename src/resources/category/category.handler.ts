import { NextFunction, Request, Response } from "express";

import CategoryService from "@resources/category/category.service";
import { ICategory } from "@resources/category/category.interface";

import HttpException from "@utils/exceptions/http.exception";
import { reqAsyncHandler } from "@utils/helpers/asyncHandler";
import isEmpty from "@utils/helpers/isEmpty";

class CategoryHandler {
  private service = CategoryService

  /** Create category. */
  public create = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Capture user.
      if (req.body.access === 'private') {
        req.body.user = req.user.id
      }

      // Normalize name.
      req.body.name = req.body.name.toLowerCase()

      // Get subcategories.
      const { subcategories, ancestor, ...rest } = req.body

      // Add back ancestor if it's not empty (Can't cast empty string to mongo id).
      if (!isEmpty(ancestor)) {
        rest.ancestor = ancestor
      }

      // Create category.
      const category = await this.service.create(rest)

      if (!category) return next(new HttpException(500, "Something went wrong."))

      // Create subcategories.
      if (subcategories.length) {
        let subcats = subcategories.map((subcat: Partial<ICategory>) => ({
          ...subcat,
          ancestor: category._id,
          user: req.user.id
        }))

        subcats = await this.service.createMany(subcats)

        console.log('category', category)
        console.log('subcats', subcats)
      }

      res.status(201).send({
        ok: true,
        category
      })
    }
  )

  /** Get category by its slug. */
  public getBySlug = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const category = await this.service.getBySlug(req.params.slug)

      if (!category) return next(new HttpException(404, 'Category does not exist'))

      res.status(200).send({
        ok: true,
        category
      })
    }
  )

  /** List categories. */
  public list = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Get query params.
      const { limit, page, ...rest } = req.query

      // Set defaults.
      const skipLimit = limit && Number(limit) ? Number(limit) : 10
      const pageNo = page && Number(page) ? Number(page) - 1 : 0

      // Get categories.
      const [categories, categoryCount] = await Promise.all([
        this.service.list(
          { $or: [{ access: 'public'}, { $and: [{ access: 'private' }, { user: req.user.id }]}]},
          skipLimit,
          pageNo
        ),
        this.service.getCount({ $or: [{ access: 'public'}, { $and: [{ access: 'private' }, { user: req.user.id }]}]})
      ])

      res.status(200).send({
        ok: true,
        items: categories,
        totalPageCount: Math.ceil(categoryCount / skipLimit)
      })
    }
  )
}

export default new CategoryHandler()