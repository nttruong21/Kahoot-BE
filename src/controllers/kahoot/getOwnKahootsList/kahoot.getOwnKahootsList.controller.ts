import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../../utils/logging.util'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'
import { SummaryUserKahoot } from '../../../types/kahoot.type'

const getOwnKahootsListController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.params['page'] ? +req.params['page'] : 1
    const limit = req.params['limit'] ? +req.params['limit'] : 10

    if (!page || !Number.isInteger(page) || page < 1) {
      return next(createError(400, 'Invalid page'))
    }
    if (!limit || !Number.isInteger(limit) || limit < 1) {
      return next(createError(400, 'Invalid limit'))
    }

    // Get own kahoots
    const kahootsResponse = (await kahootServices.getKahoots({
      userId: req.user.id,
      offset: (page - 1) * limit,
      limit
    })) as SummaryUserKahoot[]
    if (!kahootsResponse) {
      return next(createError(500))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: kahootsResponse.map((kahoot) => ({
        ...kahoot,
        createdAt: new Date(kahoot.createdAt).getTime(),
        numberOfQuestion: Number(kahoot.numberOfQuestion)
      })),
      message: 'Get own kahoots list successfully'
    })
  } catch (error) {
    logging.error('Get own kahoots list controller has error', error)
    return next(createError(500))
  }
}

export default getOwnKahootsListController
