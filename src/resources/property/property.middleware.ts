import { NextFunction, Request, Response } from 'express'

import PropertyModel from '@resources/property/property.model'

import HttpException from '@utils/exceptions/http.exception'

class PropertyMiddleware {
  private Property = PropertyModel

  public ensurePropertyOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const property = await this.Property.findById(req.params.id).select('user')

    if (!property) {
      return next(new HttpException(404, 'Property does not exist.'))
    }

    if (property.user.toString() !== req.user.id) {
      return next(new HttpException(401, 'You are not authorized to access this property.'))
    }

    next()
  }
}

export default new PropertyMiddleware()
