import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../utils/logging.util'
import * as favoritesServices from '../../services/favorites/favorites.index.service'
import * as playServices from '../../services/play/play.index.service'

const getFavoriteKahootsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 999

    // Get favorite kahoots
    const kahootsResponse = await favoritesServices.get({
      userId: req.user.id,
      limit,
      offset: (page - 1) * limit
    })
    if (!kahootsResponse) {
      return next(createError(500, 'Get favorite kahoots failure'))
    }

    const kahootsData: any = []

    await Promise.all(
      kahootsResponse.map(async (kahoot) => {
        // Get number of players
        const numberOfPlayer = await playServices.countPlayerOfKahoot(kahoot.id)
        kahootsData.push({
          ...kahoot,
          numberOfPlayer,
          numberOfQuestion: Number(kahoot.numberOfQuestion)
        })
      })
    )

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        kahoots: kahootsData,
        is_over: kahootsResponse.length < limit
      },
      message: 'Get favorite kahoots successfully'
    })
  } catch (error) {
    logging.error('Get favorite kahoots controller has error:', error)
    return next(createError(500))
  }
}

export default getFavoriteKahootsController
