import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../utils/logging.util'
import { PlaySummary, PlayType } from '../../types/play.type'
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
        if (play.type === PlayType.practice) {
          // Get kahoot by id
          const kahoot = await kahootServices.getKahoot({
            kahootId: play.kahootId!
          })
          if (!kahoot) {
            return next(createError(500, 'Get kahoot failure'))
          }

          // Get number of players
          const numberOfPlayer = await playServices.countPlayerOfKahoot(play.kahootId!)

          data.push({
            id: play.id,
            userId: play.userId,
            createdAt: new Date(play.createdAt).getTime(),
            kahootId: play.kahootId,
            kahootTitle: kahoot.title,
            assignmentId: null,
            type: play.type,
            point: play.point,
            numberOfPlayer
          })
        } else if (play.type === PlayType.assignment) {
          // Get kahoot by assignment
          const kahoot = await kahootServices.getKahoot({
            assignmentId: play.assignmentId!
          })
          if (!kahoot) {
            return next(createError(500, 'Get kahoot failure'))
          }

          // Get number of players
          const numberOfPlayer = await playServices.countPlayerOfKahoot(kahoot.id!)

          data.push({
            id: play.id,
            userId: play.userId,
            createdAt: new Date(play.createdAt).getTime(),
            kahootId: play.kahootId,
            kahootTitle: kahoot.title,
            assignmentId: play.assignmentId,
            type: play.type,
            point: play.point,
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
