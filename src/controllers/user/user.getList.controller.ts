import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import * as userServices from '../../services/user/user.index.service'
import * as kahootServices from '../../services/kahoot/kahoot.index.service'
import { KahootSummary } from '../../types/kahoot.type'

const getUsersListController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query['page'] ? +req.query['page'] : 1
    const limit = req.query['limit'] ? +req.query['limit'] : 999

    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
      return next(createError(400, 'Invalid page or limit value'))
    }

    const usersResponse = await userServices.getList({
      limit,
      offset: (page - 1) * limit,
      sessionUserId: req.user && req.user.id ? req.user.id : null
    })
    if (!usersResponse) {
      return next(createError(500))
    }

    const result: Array<{
      id: number
      username: string
      kahoots: KahootSummary[]
    }> = []

    await Promise.all(
      usersResponse.map(async (user) => {
        const kahootsResponse = await kahootServices.getKahoots({
          sessionUserId: req.user && req.user.id ? req.user.id : null,
          userId: user.id,
          limit: 5,
          offset: (page - 1) * limit
        })
        if (!kahootsResponse) {
          throw new Error('Can not get kahoots list of user')
        }
        result.push({
          id: parseInt(user.id.toString()),
          username: user.username,
          kahoots: kahootsResponse.map((kahoot) => ({
            ...kahoot,
            numberOfQuestion: Number(kahoot.numberOfQuestion)
          }))
        })
      })
    )

    return res.status(200).json({
      code: 200,
      success: true,
      data: result,
      message: 'Get users list successfully'
    })
  } catch (error) {
    logging.error('Get users list controller has error:', error)
    return next(createError(500))
  }
}

export default getUsersListController
