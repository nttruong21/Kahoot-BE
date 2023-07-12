import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import validator from 'validator'
import bcrypt from 'bcryptjs'

import logging from '~/utils/logging.util'
import { removeDots } from '~/utils/email.util'
import * as accountServices from '~/services/account/account.index.service'
import * as otpServices from '~/services/otp/otp.index.service'

type RequestBody = {
  email: string
  password: string
  otp: string
}

const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email = '', password = '', otp = '' } = req.body as RequestBody

    // Email
    const finalEmail = removeDots(email.trim())
    if (
      !validator.isEmail(finalEmail, {
        blacklisted_chars: ' '
      })
    ) {
      return next(createError(400, 'Invalid email'))
    }

    // Password
    if (
      !validator.isByteLength(password, {
        min: 6
      }) ||
      validator.contains(password, ' ')
    ) {
      return next(createError(400, 'Invalid password'))
    }

    // Otp
    if (validator.isEmpty(otp) || otp.length !== 6) {
      return next(createError(400, 'Invalid otp'))
    }

    // Check email was existed
    const account = await accountServices.getAccount({ email: finalEmail })
    if (!account) {
      return next(createError(400, 'Email is not being registered'))
    }

    // Check match otp
    const otpInDb = await otpServices.getLastOtp(finalEmail)
    if (!otpInDb || otpInDb.otp !== otp) {
      return next(createError(400, 'Otp is not match'))
    }
    if (new Date(otpInDb.expired).getTime() < new Date().getTime()) {
      return next(createError(400, 'Otp expired'))
    }

    // Update account password
    const bcryptPassword = await bcrypt.hash(password, 12)
    await accountServices.updatePassword({ email: finalEmail, password: bcryptPassword })

    return res.status(200).json({
      code: 200,
      success: true,
      data: {},
      message: 'Reset password successfully'
    })
  } catch (error) {
    logging.error('Reset password controller has error', error)
    return next(createError(500))
  }
}

export default resetPasswordController
