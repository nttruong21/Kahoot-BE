import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../../utils/logging.util'
import { VisibleScope } from '../../../enums/kahoot.enum'
import * as kahootServices from '../../../services/kahoot/kahoot.index.service'
import * as playServices from '../../../services/play/play.index.service'

const getKahootsListController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 999
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

    // Get kahoots list
    const kahootsResponse = await kahootServices.getKahoots({
      sessionUserId: req.user && req.user.id ? req.user.id : null,
      scope: VisibleScope.public,
      userId,
      offset: (page - 1) * limit,
      limit
    })
    if (!kahootsResponse) {
      return next(createError(500, 'Get kahoots list failure'))
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
      message: 'Get kahoots list successfully'
    })
  } catch (error) {
    logging.error('Get kahoots list controller has error', error)
    return next(createError(500))
  }
}

export default getKahootsListController
