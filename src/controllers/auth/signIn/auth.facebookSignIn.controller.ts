import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import createError from 'http-errors'
import otpGenerator from 'otp-generator'
import validator from 'validator'

import logging from '../../../utils/logging.util'
import * as jwtServices from '../../../services/jwt/jwt.index.service'
import * as accountServices from '../../../services/account/account.index.service'
import * as userServices from '../../../services/user/user.index.service'
import { TokenPayload } from '../../../types/tokenPayload.type'
import { AccountType } from '../../../enums/account.enum'

type RequestBody = {
  facebookId: string
  facebookToken: string
}

const facebookSignInController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get id, token of facebook auth
    const { facebookId, facebookToken } = req.body as RequestBody

    // Validation
    if (validator.isEmpty(facebookId)) {
      return next(createError(400, 'Invalid facebook id'))
    }
    if (validator.isEmpty(facebookToken)) {
      return next(createError(400, 'Invalid facebook token'))
    }

    // Verify facebook token
    const { data: facebookAccountVerifiedData } = await axios.get(
      `https://graph.facebook.com/me?access_token=${facebookToken}`
    )
    if (!facebookAccountVerifiedData || facebookAccountVerifiedData.id !== facebookId) {
      return next(createError(401))
    }

    // Get facebook user data
    const facebookUserData = (
      await axios.get(`https://graph.facebook.com/${facebookId}?fields=email,name&access_token=${facebookToken}`)
    ).data

    // Check account is existed or not
    const account = await accountServices.getAccount({ fbid: facebookId })

    let responseData: any
    let userId: number | null

    if (account) {
      userId = account.id

      // Get user
      const user = await userServices.getUser({ id: userId })
      if (!user) {
        return next(createError(500))
      }

      // Set response data
      responseData = {
        id: userId,
        name: user.name,
        username: user.username,
        image: user.image,
        created_at: user.created_at.getTime()
      }
    } else {
      // Create random username
      const randomUsername =
        facebookUserData.name.toLocaleLowerCase().split(' ').join('-') + '-' + otpGenerator.generate(6)

      // Create account
      const dateNow = new Date()
      userId = await accountServices.createAccount(AccountType.google, {
        fbid: facebookId,
        date: dateNow
      })

      if (!userId) {
        return next(createError(500))
      }

      // Create user
      await userServices.createUser(
        userId,
        randomUsername,
        'https://storage.googleapis.com/kahoot-nodejs-c67a0.appspot.com/images/default-avt.jpg?GoogleAccessId=firebase-adminsdk-kkws4%40kahoot-nodejs-c67a0.iam.gserviceaccount.com&Expires=16730298000&Signature=rhW5g%2ByrJxxOJJS54Kpx00QzFLIwI5RItJtTeKhNmjSck2UfMyS%2BEDXjfAds0jICPHKXfr5YQw8KdiSruAjqX%2Fwr07Uw0U13Jj5eF%2FArn4sODgxfStanW2f9jU%2FC7VgU2PWfzsZBSZUCz6DD9dFizdMZwgSpxp2xRAncwSrlapRhSkfU2JL2NJ9SYt4COz7fdcvOp3VTq9ps4NbXlUmBPC3T78LgZsVjyV3ft6VyZYyHQFircMBnRtUsOYooPlnCYgHX8aMYgCZEOp1Ggy%2FSPmSiQthcnqouO4DDn2g53jSb7fMNpMK8CkOyJqR1BAgfgpEYt%2BVl7DNiaD80zeDxqA%3D%3D',
        dateNow
      )

      // Set response data
      responseData = {
        id: userId,
        name: randomUsername,
        username: randomUsername,
        image:
          'https://storage.googleapis.com/kahoot-nodejs-c67a0.appspot.com/images/default-avt.jpg?GoogleAccessId=firebase-adminsdk-kkws4%40kahoot-nodejs-c67a0.iam.gserviceaccount.com&Expires=16730298000&Signature=rhW5g%2ByrJxxOJJS54Kpx00QzFLIwI5RItJtTeKhNmjSck2UfMyS%2BEDXjfAds0jICPHKXfr5YQw8KdiSruAjqX%2Fwr07Uw0U13Jj5eF%2FArn4sODgxfStanW2f9jU%2FC7VgU2PWfzsZBSZUCz6DD9dFizdMZwgSpxp2xRAncwSrlapRhSkfU2JL2NJ9SYt4COz7fdcvOp3VTq9ps4NbXlUmBPC3T78LgZsVjyV3ft6VyZYyHQFircMBnRtUsOYooPlnCYgHX8aMYgCZEOp1Ggy%2FSPmSiQthcnqouO4DDn2g53jSb7fMNpMK8CkOyJqR1BAgfgpEYt%2BVl7DNiaD80zeDxqA%3D%3D',
        created_at: dateNow.getTime()
      }
    }

    // Sign access token & refresh token
    const payload: TokenPayload = {
      id: userId
    }
    const accessToken = await jwtServices.signAccessTokenService(payload)
    const refreshToken = await jwtServices.signRefreshTokenService(payload)

    // Success response
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Sign in by facebook successfully',
      data: {
        ...responseData,
        access_token: accessToken,
        refresh_token: refreshToken
      }
    })
  } catch (error) {
    logging.error('Facebook sign in controller has error', error)
    return next(createError(500))
  }
}

export default facebookSignInController
