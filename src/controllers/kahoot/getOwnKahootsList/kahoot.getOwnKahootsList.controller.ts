import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../../utils/logging.util'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'

const getOwnKahootsListController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 5

    if (!page || !Number.isInteger(page) || page < 1) {
      return next(createError(400, 'Invalid page'))
    }
    if (!limit || !Number.isInteger(limit) || limit < 1) {
      return next(createError(400, 'Invalid limit'))
    }

    // Get own kahoots
    const kahootsResponse = await kahootServices.getKahoots({
      userId: req.user.id,
      offset: (page - 1) * limit,
      limit
    })
    if (!kahootsResponse) {
      return next(createError(500))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        kahoots: kahootsResponse.map((kahoot) => ({
          ...kahoot,
          createdAt: new Date(kahoot.createdAt).getTime(),
          numberOfQuestion: Number(kahoot.numberOfQuestion)
        })),
        is_over: kahootsResponse.length < limit
      },
      message: 'Get own kahoots list successfully'
    })
  } catch (error) {
    logging.error('Get own kahoots list controller has error', error)
    return next(createError(500))
  }
}

export default getOwnKahootsListController