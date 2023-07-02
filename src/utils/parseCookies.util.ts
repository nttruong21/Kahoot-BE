const parseCookies = (cookieHeader: string): { [key: string]: string } => {
  let cookies = {}
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=')
    const name = parts.shift()?.trim()
    const value = decodeURIComponent(parts.join('='))
    name && (cookies = { ...cookies, [name]: value })
  })
  return cookies
}

export default parseCookies
