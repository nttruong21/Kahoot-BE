import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../../utils/logging.util'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'
import * as playServices from '../../../services/play/play.index.service'

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
      sessionUserId: req.user.id,
      userId: req.user.id,
      offset: (page - 1) * limit,
      limit
    })
    if (!kahootsResponse) {
      return next(createError(500, 'Get own kahoots list failure'))
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
      message: 'Get own kahoots list successfully'
    })
  } catch (error) {
    logging.error('Get own kahoots list controller has error', error)
    return next(createError(500))
  }
}

export default getOwnKahootsListController
