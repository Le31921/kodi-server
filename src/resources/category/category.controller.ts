import { Router } from "express";

import IController from "@utils/interfaces/controller.interface";

import validationMiddleware from "@middleware/validation.middleware";
import ensureAuthenticated from "@middleware/ensureAuthenticated.middlware";

import CategoryHandler from "@resources/category/category.handler";
import CategoryMiddleware from "@resources/category/category.middleware";
import CategoryValidation from "@resources/category/category.validation";

class CategoryController implements IController {
  path = '/categories'
  router = Router()

  private handler = CategoryHandler
  private middleware = CategoryMiddleware
  private validation = CategoryValidation

  constructor() {
    this.initRoutes()
  }

  private initRoutes = (): void => {
    /**
     * @desc Create a category.
     * @path /api/categories
     * @method POST
     */
    this.router.post(
      this.path,
      ensureAuthenticated,
      validationMiddleware(this.validation.create),
      this.middleware.ensureUniqueName,
      this.handler.create
    )
    
    /**
     * @desc List categories.
     * @path /api/categories
     * @method GET
     */
    this.router.get(
      this.path,
      ensureAuthenticated,
      this.handler.list
    )

    /**
     * @desc Get a category.
     * @path /api/categories/:slug
     * @method GET
     */
    this.router.get(
      this.path + '/:slug',
      // ensureAuthenticated,
      this.handler.getBySlug
    )

  }
}

export default new CategoryController()