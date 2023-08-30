import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../utils/logging.util'
import * as playServices from '../../services/play/play.index.service'

const getTopPlayersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignmentId = req.query['assignmentId'] ? +req.query['assignmentId'] : undefined

    // Validation
    if (assignmentId && !Number.isInteger(assignmentId)) {
      return next(createError(400, 'Invalid assignment id'))
    }

    // Get players of assignment
    const topPlayers = await playServices.getTopPlayers({ assignmentId, limit: 999 })
    if (!topPlayers) {
      return next(createError(500, 'Get top players failure'))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: topPlayers,
      message: 'Get top players successfully'
    })
  } catch (error) {
    logging.error('Get top players controller has error:', error)
    throw error
  }
}

export default getTopPlayersController
