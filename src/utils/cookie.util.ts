// import { Response } from 'express'
// import dayjs from 'dayjs'

// import * as cookieServices from '../../services/cookie/cookie.index.service'

// const parseCookie = (cookieHeader: string): { [key: string]: string } => {
//   let cookies = {}
//   cookieHeader.split(';').forEach((cookie) => {
//     const parts = cookie.split('=')
//     const name = parts.shift()?.trim()
//     const value = decodeURIComponent(parts.join('='))
//     name && (cookies = { ...cookies, [name]: value })
//   })
//   return cookies
// }

// const resetCookie = (res: Response) => {
//   res.cookie('access-token', '', {
//     secure: process.env.NODE_ENV !== 'development',
//     httpOnly: true,
//     expires: dayjs().add(0, 'hour').toDate(),
//     sameSite: true
//   })

//   res.cookie('refresh-token', '', {
//     secure: process.env.NODE_ENV !== 'development',
//     httpOnly: true,
//     expires: dayjs().add(0, 'hour').toDate(),
//     sameSite: true
//   })
// }

// const setTokenCookie = (res: Response, accessToken: string, refreshToken: string) => {
//   res.cookie('access-token', cookieServices.encrypt(accessToken), {
//     secure: process.env.NODE_ENV !== 'development',
//     httpOnly: true,
//     expires: dayjs().add(30, 'day').toDate(),
//     sameSite: true
//   })

//   res.cookie('refresh-token', cookieServices.encrypt(refreshToken), {
//     secure: process.env.NODE_ENV !== 'development',
//     httpOnly: true,
//     expires: dayjs().add(30, 'day').toDate(),
//     sameSite: true
//   })
// }

// export { parseCookie, resetCookie, setTokenCookie }
