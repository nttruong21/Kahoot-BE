import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import * as userServices from '../../services/user/user.index.service'
import * as sharedServices from '../../services/shared/shared.index.service'

interface RequestBody {
  usernames: string[]
  kahootId: number
}

const shareKahootController = async (req: Request, res: Response, next: NextFunction) => {
  const { usernames = [], kahootId } = req.body as RequestBody

  if (usernames.length === 0) {
    return next(createError(400, 'Invalid usernames'))
  }

  if (!Number.isInteger(kahootId) || kahootId < 1) {
    return next(createError(400, 'Invalid kahoot id'))
  }

  // Get user ids by usernames
  const userIds = await userServices.getUserIds({ usernames })
  if (!userIds || userIds.length === 0) {
    return next(createError(500, 'Get user ids failure'))
  }

  // Handle share
  const shareResponse = await sharedServices.shareKahoot({ kahootId, sharerId: req.user.id, sharedIds: userIds })
  if (!shareResponse) {
    return next(createError(500, 'Share kahoot failure'))
  }

  try {
    return res.status(200).json({
      code: 200,
      success: true,
      data: {},
      message: 'Share kahoot successfully'
    })
  } catch (error) {
    logging.error('Share kahoot controller has error:', error)
    return next(createError(500, 'Share kahoot controller failure'))
  }
}

export default shareKahootController
