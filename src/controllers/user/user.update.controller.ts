import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import logging from '../../utils/logging.util'
import myFormidable from '../../configs/formidable.config'
import { uploadImage } from '../../configs/firebaseUpload.config'
import * as userServices from '../../services/user/user.index.service'

const updateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    myFormidable.parse(req, async (err, fields, files) => {
      if (err) {
        return next(createError(500, 'Parse form data failure'))
      }

      const username = fields['username'][0]
      const userImage = fields['userImage'][0]
      const file = Array.isArray(files['images']) ? files['images'][0] : files['images']
      if (!username) {
        return next(createError(400, 'Invalid username'))
      }
      if (!userImage && !file) {
        return next(createError(400, 'Invalid user image'))
      }

      const userImageUrl = file ? await uploadImage(file.newFilename) : userImage

      const updateResponse = await userServices.update({
        id: req.user.id,
        username,
        image: userImageUrl
      })
      if (!updateResponse) {
        return next(createError(500, 'Update user failure'))
      }

      return res.status(200).json({
        code: 200,
        success: true,
        data: {
          id: req.user.id,
          username,
          image: userImageUrl
        },
        message: 'Update user successfully'
      })
    })
  } catch (error) {
    logging.error('Update user controller has error:', error)
    return next(createError(500, 'Update user failure'))
  }
}

export default updateController
