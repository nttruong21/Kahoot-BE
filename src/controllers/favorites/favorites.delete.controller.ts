import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import logging from '../../utils/logging.util'
import * as favoritesServices from '../../services/favorites/favorites.index.service'

interface RequestBody {
  kahootId: number
}

const deleteFavoriteKahootController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { kahootId = null } = req.body as RequestBody
    if (!kahootId || !Number.isInteger(kahootId) || kahootId < 1) {
      return next(createError(400, 'Invalid kahoot id'))
    }

    // Delete
    await favoritesServices.delete({
      userId: req.user.id,
      kahootId
    })

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        userId: req.user.id,
        kahootId
      },
      message: 'Delete favorite kahoot successfully'
    })
  } catch (error) {
    logging.error('Delete favorite kahoot controller has error:', error)
    throw error
  }
}

export default deleteFavoriteKahootController
