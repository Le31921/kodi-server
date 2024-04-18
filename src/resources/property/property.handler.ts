import { NextFunction, Request, Response } from "express";

import PropertyService from "@resources/property/property.service";

import { reqAsyncHandler } from "@utils/helpers/asyncHandler";
import isEmpty from "@utils/helpers/isEmpty";

class PropertyHandler {
  private service = PropertyService

  /** Creates a new property. */
  public create = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Add user.
      req.body.user = req.user.id

      // Delete refs if empty.
      if (isEmpty(req.body.category)) delete req.body.category
      if (isEmpty(req.body.account)) delete req.body.account

      // Create property.
      const property = await this.service.create(req.body)
      
      res.status(201).send({
        ok: true,
        property,
      })
    }
  )

  /** Gets a single property. */
  public get = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Get property.
      const property = await this.service.get(req.params.id)

      res.status(200).send({
        ok: true,
        property,
      })
    }
  )

  /** Lists a user's properties. */
  public list = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Get queries.
      const { limit, page, ...rest } = req.query

      // Set defaults.
      const skipLimit = limit && Number(limit) ? Number(limit) : 10
      const pageNo = page && Number(page) ? Number(page) - 1 : 0

      // Get properties and count.
      const [properties, totalPropertyCount] = await Promise.all([
        this.service.list(
          { ...rest, user: req.user.id },
          skipLimit,
          pageNo
        ),
        this.service.getCount({...rest, user: req.user.id})
      ])

      res.status(200).send({
        ok: true,
        items: properties,
        totalPageCount: Math.ceil(totalPropertyCount / skipLimit),
      })
    }
  )

  /** Update a property. */
  public update = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Delete refs if empty.
      if (isEmpty(req.body.category)) delete req.body.category
      if (isEmpty(req.body.account)) delete req.body.account

      // Update property.
      const property = await this.service.update(req.params.id, req.body)

      res.status(200).send({
        ok: true,
        property,
      })
    }
  )

  /** Deletes property. */
  public remove = reqAsyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      // Delete property.
      const property = await this.service.remove(req.params.id)

      res.status(200).send({
        ok: true
      })
    }
  )
}

export default new PropertyHandler()