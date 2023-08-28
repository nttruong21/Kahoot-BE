import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../../utils/logging.util'
import { VisibleScope } from '../../../enums/kahoot.enum'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'

const getKahootsListController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 5
    const userId = req.query['userId'] ? +req.query['userId'] : undefined

    if (!page || !Number.isInteger(page) || page < 1) {
      return next(createError(400, 'Invalid page'))
    }
    if (!limit || !Number.isInteger(limit) || limit < 1) {
      return next(createError(400, 'Invalid limit'))
    }
    if (userId && !Number.isInteger(userId)) {
      return next(createError(400, 'Invalid user id'))
    }

    // Get public kahoots
    const kahootsResponse = await kahootServices.getKahoots({
      sessionUserId: req.user && req.user.id ? req.user.id : null,
      scope: VisibleScope.public,
      userId,
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
          numberOfQuestion: Number(kahoot.numberOfQuestion)
        })),
        is_over: kahootsResponse.length < limit
      },
      message: 'Get public kahoots list successfully'
    })
  } catch (error) {
    logging.error('Get kahoots list controller has error', error)
    return next(createError(500))
  }
}

export default getKahootsListController
