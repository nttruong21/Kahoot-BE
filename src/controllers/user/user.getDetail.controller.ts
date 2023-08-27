import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import * as userServices from '../../services/user/user.index.service'
import * as playServices from '../../services/play/play.index.service'

const getUserDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params['id'] ? +req.params['id'] : null
    if (!userId || !Number.isInteger(userId) || userId < 1) {
      return next(createError(400, 'Invalid user id'))
    }

    // Get user detail
    const userDetailResponse = await userServices.getDetail({
      userId
    })
    if (!userDetailResponse) {
      return next(createError(500))
    }

    // Count plays of user
    const numberOfPlays = await playServices.countPlayOfUser({ userId })

    // Count players of user
    const numberOfPlayers = await playServices.countPlayersOfUser({ userId })

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        ...userDetailResponse,
        numberOfKahoots: parseInt(userDetailResponse.numberOfKahoots.toString()),
        id: parseInt(userDetailResponse.id.toString()),
        numberOfPlays: numberOfPlays,
        numberOfPlayers: numberOfPlayers
      },
      message: 'Get user detail successfully'
    })
  } catch (error) {
    logging.error('Get user detail controller has error:', error)
    return next(createError(500))
  }
}

export default getUserDetailController
