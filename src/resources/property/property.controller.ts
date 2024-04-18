import { Router } from "express";

import IController from "@utils/interfaces/controller.interface";

import PropertyHandler from "./property.handler";
import ensureAuthenticated from "@middleware/ensureAuthenticated.middlware";
import validationMiddleware from "@middleware/validation.middleware";
import propertyValidation from "./property.validation";
import propertyMiddleware from "./property.middleware";


class PropertyController implements IController {
  path: string = '/properties'
  router: Router = Router()

  private handler = PropertyHandler
  private validation = propertyValidation

  constructor() {
    this.initRoutes()
  }

  private initRoutes = (): void => {
    /**
     * @desc Create a transaction.
     * @path /api/properties
     * @method POST
     */
    this.router.post(
      this.path,
      ensureAuthenticated,
      validationMiddleware(this.validation.create),
      this.handler.create
    )

    /**
     * @desc List properties.
     * @path /api/properties
     * @method GET
     */
    this.router.get(
      this.path,
      this.handler.list
    )

    /**
     * @desc Get a single property.
     * @path /api/properties/:id
     * @method GET
     */
    this.router.get(
      this.path + '/:id',
      this.handler.get
    )

    /**
     * @desc Update a transaction.
     * @path /api/transactions/:id
     * @method PATCH
     */
    this.router.patch(
      this.path + '/:id',
      ensureAuthenticated,
      propertyMiddleware.ensurePropertyOwner,
      validationMiddleware(this.validation.create),
      this.handler.update
    )

    /**
     * @desc Delete a property.
     * @path /api/properties/:id
     * @method DELETE
     */
    this.router.delete(
      this.path + '/:id',
      ensureAuthenticated,
      propertyMiddleware.ensurePropertyOwner,
      this.handler.remove
    )
  }
}

export default new PropertyController()