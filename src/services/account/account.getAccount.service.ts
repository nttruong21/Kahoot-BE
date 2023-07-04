import { executeQuery } from '~/configs/database.config'
import { AccountModel } from '~/models/account.model'
import logging from '~/utils/logging.util'

type Parameters = {
  email?: string
  ggid?: string
  fbid?: string
}

const getAccountByEmailService = async (parameters: Parameters) => {
  try {
    let query
    let params

    if (parameters.email) {
      query = 'SELECT * FROM accounts WHERE email = ? LIMIT 1'
      params = [parameters.email]
    } else if (parameters.ggid) {
      query = 'SELECT * FROM accounts WHERE email = ? LIMIT 1'
      params = [parameters.ggid]
    } else if (parameters.fbid) {
      query = 'SELECT * FROM accounts WHERE email = ? LIMIT 1'
      params = [parameters.email]
    }

    if (query && params) {
      const response = await executeQuery<AccountModel[]>(query, params) // []
      return response[0]
    }
    return null
  } catch (error) {
    logging.error('Get account by email service has error', error)
    throw error
  }
}

export default getAccountByEmailService
