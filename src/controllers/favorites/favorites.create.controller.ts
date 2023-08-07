import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../utils/logging.util'
import * as favoritesServices from '../../services/favorites/favorites.index.service'

interface RequestBody {
  kahootId: number
}

const createFavoriteKahootController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { kahootId = null } = req.body as RequestBody
    if (!kahootId || !Number.isInteger(kahootId) || kahootId < 1) {
      return next(createError(400, 'Invalid kahoot id'))
    }

    // Create
    const response = await favoritesServices.create({
      userId: req.user.id,
      kahootId
    })
    if (!response) {
      return next(createError(500))
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: response,
      message: 'Create favorite kahoot successfully'
    })
  } catch (error) {
    logging.error('Create favorite kahoot controller has error', error)
    return next(createError(500))
  }
}

export default createFavoriteKahootController
