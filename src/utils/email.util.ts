function removeDots(email: string) {
  var email_s = email.split('@')
  return email_s[0].replace(/\./g, '') + '@' + email_s[1]
}

export { removeDots }
