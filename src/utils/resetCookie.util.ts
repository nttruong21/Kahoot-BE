import { Response } from 'express'
import dayjs from 'dayjs'

const resetCookie = (res: Response) => {
  res.cookie('access-token', '', {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    expires: dayjs().add(0, 'hour').toDate(),
    sameSite: true
  })

  res.cookie('refresh-token', '', {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    expires: dayjs().add(0, 'hour').toDate(),
    sameSite: true
  })
}

export default resetCookie
