import { NextFunction, Request, Response } from "express";

import Category from "@resources/category/category.model";

import HttpException from "@utils/exceptions/http.exception";

class CategoryMiddleware {
  private category = Category

  public ensureUniqueName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const existingCategory = await this.category.findOne({
      name: req.body.name.toLowerCase(),
      access: 'public'
    })

    if (existingCategory) {
      return next(new HttpException(400, 'Category already exists.'))
    }

    next()
  }
}

export default new CategoryMiddleware()