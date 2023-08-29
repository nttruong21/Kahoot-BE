import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import * as sharedServices from '../../services/shared/shared.index.service'

const getSharedKahootsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 999

    // Get shared kahoots
    const response = await sharedServices.get({
      userId: req.user.id,
      limit,
      offset: (page - 1) * limit
    })
    if (!response) {
      return next(createError(500, 'Get shared kahoots failure'))
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
      message: 'Get shared kahoots successfully'
    })
  } catch (error) {
    logging.error('Get shared kahoots controller has error:', error)
    return next(createError(500, 'Get shared kahoots failure'))
  }
}

export default getSharedKahootsController
