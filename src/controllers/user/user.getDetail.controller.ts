import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import * as userServices from '../../services/user/user.index.service'

const getUserDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params['id'] ? +req.params['id'] : null
    if (!userId || !Number.isInteger(userId) || userId < 1) {
      return next(createError(400, 'Invalid user id'))
    }

    const userDetailResponse = await userServices.getDetail({
      userId
    })
    if (!userDetailResponse) {
      return next(createError(500))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        ...userDetailResponse,
        numberOfKahoots: parseInt(userDetailResponse.numberOfKahoots.toString()),
        id: parseInt(userDetailResponse.id.toString()),
        numberOfPlays: 0,
        numberOfPlayers: 0
      },
      message: 'Get user detail successfully'
    })
  } catch (error) {
    logging.error('Get user detail controller has error:', error)
    return next(createError(500))
  }
}

export default getUserDetailController
