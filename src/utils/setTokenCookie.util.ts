import { Response } from 'express'
import dayjs from 'dayjs'

import * as cookieServices from '~/services/cookie/cookie.index.service'

const setTokenCookie = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('access-token', cookieServices.encrypt(accessToken), {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    expires: dayjs().add(30, 'day').toDate(),
    sameSite: true
  })

  res.cookie('refresh-token', cookieServices.encrypt(refreshToken), {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    expires: dayjs().add(30, 'day').toDate(),
    sameSite: true
  })
}

export default setTokenCookie
