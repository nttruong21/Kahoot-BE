import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../utils/logging.util'
import { PlaySummary } from '../../types/play.type'
import * as playServices from '../../services/play/play.index.service'
import * as kahootServices from '../../services/kahoot/kahoot.index.service'

const getPlaysListController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plays = await playServices.getList({
      userId: req.user.id
    })

    const data: PlaySummary[] = []

    await Promise.all(
      plays.map(async (play) => {
        if (play.kahootId) {
          // Get kahoot by id
          const kahoot = await kahootServices.getKahoot({
            kahootId: play.kahootId
          })
          if (!kahoot) {
            return next(createError(500, 'Get kahoot failure'))
          }

          // Get number of players
          const numberOfPlayer = await playServices.countPlayerOfKahoot(play.kahootId)

          data.push({
            id: play.id,
            userId: play.userId,
            createdAt: +play.createdAt,
            kahootId: play.kahootId,
            kahootTitle: kahoot.title,
            assignmentId: null,
            numberOfPlayer
          })
        } else if (play.assignmentId) {
          // Get kahoot by assignment
          const kahoot = await kahootServices.getKahoot({
            assignmentId: play.assignmentId
          })
          if (!kahoot) {
            return next(createError(500, 'Get kahoot failure'))
          }

          // Get number of players
          const numberOfPlayer = await playServices.countPlayerOfKahoot(kahoot.id!)

          data.push({
            id: play.id,
            userId: play.userId,
            createdAt: +play.createdAt,
            kahootId: play.kahootId,
            kahootTitle: kahoot.title,
            assignmentId: play.assignmentId,
            numberOfPlayer
          })
        }
      })
    )

    return res.status(200).json({
      code: 200,
      success: true,
      data,
      message: 'Get plays list successfully'
    })
  } catch (error) {
    logging.error('Get plays list controller has error:', error)
    return next(createError(500))
  }
}

export default getPlaysListController
