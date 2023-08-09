import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../../utils/logging.util'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'

const getOwnKahootsListController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get own kahoots
    const kahootsResponse = await kahootServices.getKahoots({
      userId: req.user.id
    })
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
