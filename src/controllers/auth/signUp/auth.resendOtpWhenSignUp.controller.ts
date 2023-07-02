import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import otpGenerator from 'otp-generator'
import dayjs from 'dayjs'

import logging from '~/utils/logging.util'
import * as otpServices from '~/services/otp/otp.index.service'
import { getMailOptions, mailTransporter } from '~/configs/mailer.config'

type RequestBody = {
  email: string
}

const resendOtpWhenSignUpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body as RequestBody

    // Create OTP string
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    })

    // Mail options
    const mailOptions = getMailOptions(email, 'Kahoot: Sign up OTP', otp)

    // Send mail
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
          message: 'Resend otp successfully'
        })
      }
    })
  } catch (error) {
    logging.error('Send otp when sign up controller has error', error)
    return next(createError(500))
  }
}
export default resendOtpWhenSignUpController
