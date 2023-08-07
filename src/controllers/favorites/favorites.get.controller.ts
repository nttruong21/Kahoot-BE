import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../utils/logging.util'
import * as favoritesServices from '../../services/favorites/favorites.index.service'

const getFavoriteKahootsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 5

    // Get favorite kahoots
    const response = await favoritesServices.get({
      userId: req.user.id,
      limit,
      offset: (page - 1) * limit
    })
    if (!response) {
      return next(createError(500))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: response.map((kahoot) => {
        return {
          ...kahoot,
          createdAt: new Date(kahoot.createdAt).getTime(),
          numberOfQuestion: Number(kahoot.numberOfQuestion)
        }
      }),
      message: 'Get favorite kahoots successfully'
    })
  } catch (error) {
    logging.error('Get favorite kahoots controller has error:', error)
    return next(createError(500))
  }
}

export default getFavoriteKahootsController
