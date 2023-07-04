import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import otpGenerator from 'otp-generator'
import dayjs from 'dayjs'
import validator from 'validator'

import logging from '~/utils/logging.util'
import { mailTransporter, getMailOptions } from '~/configs/mailer.config'
import * as accountServices from '~/services/account/account.index.service'
import * as userServices from '~/services/user/user.index.service'
import * as otpServices from '~/services/otp/otp.index.service'

type RequestBody = {
  email: string
  username: string
}

const sendOtpWhenSignUpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username = '' } = req.body as RequestBody

    // Validate username
    if (
      !validator.isByteLength(username, {
        min: 6
      }) ||
      validator.contains(username, ' ')
    ) {
      return next(createError(400, 'Invalid username'))
    }

    // Check email was existed
    const account = await accountServices.getAccount({ email })
    if (account) {
      return next(createError(400, 'Email is being used'))
    }

    // Check username was existed
    const user = await userServices.getUser({ username: username })
    if (user) {
      return next(createError(400, 'Username is being used'))
    }

    // Create OTP string
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    })

    // Mail options
    const mailOptions = getMailOptions(email, 'Kahoot: Sign up OTP', otp)

    mailTransporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        logging.error('Sending email has error', error)
        return next(createError(500))
      } else {
        // Create OTP
        const expired = dayjs(Date.now()).add(70, 'seconds').toDate()
        await otpServices.createOtp(email, otp, expired)

        return res.status(200).json({
          code: 200,
          success: true,
          data: {
            email,
            otp,
            expired: expired.getTime()
          },
          message: 'Send otp successfully'
        })
      }
    })
  } catch (error) {
    logging.error('Send otp when sign up controller has error', error)
    return next(createError(500))
  }
}
export default sendOtpWhenSignUpController
