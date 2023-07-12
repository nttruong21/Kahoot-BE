import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import validator from 'validator'

import logging from '~/utils/logging.util'
import * as otpServices from '~/services/otp/otp.index.service'
import { removeDots } from '~/utils/email.util'

type RequestBody = {
  email: string
}

const validateSendingOtpRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get email
    const { email = '' } = req.body as RequestBody
    const finalEmail = removeDots(email.trim())
    if (
      !validator.isEmail(finalEmail, {
        blacklisted_chars: ' '
      })
    ) {
      return next(createError(400, 'Invalid email'))
    }

    // Get last otp by email
    const lastOtp = await otpServices.getLastOtp(email)
    if (!lastOtp) {
      req.body.email = finalEmail
      return next()
    }

    // Check otp is still expire
    if (new Date(lastOtp.expired).getTime() > new Date().getTime()) {
      return next(createError(409, 'Otp still expire'))
    }

    // Can make request
    req.body.email = finalEmail
    return next()
  } catch (error) {
    logging.error('Validate sending otp request middleware has error: ', error)
    return next(createError(500))
  }
}

export default validateSendingOtpRequestMiddleware
