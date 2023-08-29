import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../utils/logging.util'
import * as favoritesServices from '../../services/favorites/favorites.index.service'

const getFavoriteKahootsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 999

    // Get favorite kahoots
    const response = await favoritesServices.get({
      userId: req.user.id,
      limit,
      offset: (page - 1) * limit
    })
    if (!response) {
      return next(createError(500, 'Get favorite kahoots failure'))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        kahoots: response.map((kahoot) => ({
          ...kahoot,
          createdAt: new Date(kahoot.createdAt).getTime(),
          numberOfQuestion: Number(kahoot.numberOfQuestion)
        })),
        is_over: response.length < limit
      },
      message: 'Get favorite kahoots successfully'
    })
  } catch (error) {
    logging.error('Get favorite kahoots controller has error:', error)
    return next(createError(500))
  }
}

export default getFavoriteKahootsController
