import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import validator from 'validator'
import bcrypt from 'bcryptjs'

import logging from '../../../utils/logging.util'
import { removeDots } from '../../../utils/email.util'
import * as accountServices from '../../../services/account/account.index.service'
import * as userServices from '../../../services/user/user.index.service'
import * as jwtServices from '../../../services/jwt/jwt.index.service'
import * as otpServices from '../../../services/otp/otp.index.service'
import { TokenPayload } from '../../../types/tokenPayload.type'
import { AccountType } from '../../../enums/account.enum'

type RequestBody = {
  email: string
  password: string
  username: string
  otp: string
}

const signUpControllerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email = '', password = '', username = '', otp = '' } = req.body as RequestBody

    // Validation
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

    // Username
    if (validator.isEmpty(username)) {
      return next(createError(400, 'Invalid username'))
    }

    // Otp
    if (validator.isEmpty(otp) || otp.length !== 6) {
      return next(createError(400, 'Invalid otp'))
    }

    // Check match otp
    const otpInDb = await otpServices.getLastOtp(finalEmail)
    if (!otpInDb || otpInDb.otp !== otp) {
      return next(createError(400, 'Otp is not match'))
    }
    if (new Date(otpInDb.expired).getTime() < new Date().getTime()) {
      return next(createError(400, 'Otp expired'))
    }

    // Check username was existed
    const user = await userServices.getUser({ username: username })
    if (user) {
      return next(createError(400, 'Username is being used'))
    }

    // Create account
    const bcryptPassword = await bcrypt.hash(password, 12)
    const dateNow = new Date()
    const accountId = await accountServices.createAccount(AccountType.email, {
      email: finalEmail,
      password: bcryptPassword,
      date: dateNow
    })
    if (!accountId) {
      return next(createError(500))
    }

    // Create user
    await userServices.createUser(
      accountId,
      username,
      'https://storage.googleapis.com/kahoot-nodejs-c67a0.appspot.com/images/default-avt.jpg?GoogleAccessId=firebase-adminsdk-kkws4%40kahoot-nodejs-c67a0.iam.gserviceaccount.com&Expires=16730298000&Signature=rhW5g%2ByrJxxOJJS54Kpx00QzFLIwI5RItJtTeKhNmjSck2UfMyS%2BEDXjfAds0jICPHKXfr5YQw8KdiSruAjqX%2Fwr07Uw0U13Jj5eF%2FArn4sODgxfStanW2f9jU%2FC7VgU2PWfzsZBSZUCz6DD9dFizdMZwgSpxp2xRAncwSrlapRhSkfU2JL2NJ9SYt4COz7fdcvOp3VTq9ps4NbXlUmBPC3T78LgZsVjyV3ft6VyZYyHQFircMBnRtUsOYooPlnCYgHX8aMYgCZEOp1Ggy%2FSPmSiQthcnqouO4DDn2g53jSb7fMNpMK8CkOyJqR1BAgfgpEYt%2BVl7DNiaD80zeDxqA%3D%3D',
      dateNow
    )

    // Sign access token & refresh token
    const payload: TokenPayload = {
      id: accountId
    }
    const accessToken = await jwtServices.signAccessTokenService(payload)
    const refreshToken = await jwtServices.signRefreshTokenService(payload)

    // Success response
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Sign up successfully',
      data: {
        id: accountId,
        name: username,
        username,
        image:
          'https://storage.googleapis.com/kahoot-nodejs-c67a0.appspot.com/images/default-avt.jpg?GoogleAccessId=firebase-adminsdk-kkws4%40kahoot-nodejs-c67a0.iam.gserviceaccount.com&Expires=16730298000&Signature=rhW5g%2ByrJxxOJJS54Kpx00QzFLIwI5RItJtTeKhNmjSck2UfMyS%2BEDXjfAds0jICPHKXfr5YQw8KdiSruAjqX%2Fwr07Uw0U13Jj5eF%2FArn4sODgxfStanW2f9jU%2FC7VgU2PWfzsZBSZUCz6DD9dFizdMZwgSpxp2xRAncwSrlapRhSkfU2JL2NJ9SYt4COz7fdcvOp3VTq9ps4NbXlUmBPC3T78LgZsVjyV3ft6VyZYyHQFircMBnRtUsOYooPlnCYgHX8aMYgCZEOp1Ggy%2FSPmSiQthcnqouO4DDn2g53jSb7fMNpMK8CkOyJqR1BAgfgpEYt%2BVl7DNiaD80zeDxqA%3D%3D',
        created_at: dateNow.getTime(),
        access_token: accessToken,
        refresh_token: refreshToken
      }
    })
  } catch (error) {
    logging.error('Send otp when sign up controller has error', error)
    return next(createError(500))
  }
}
export default signUpControllerController
