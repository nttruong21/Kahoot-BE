import logging from '~/utils/logging.util'

import { executeQuery } from '~/configs/database.config'
import { AccountType } from '~/enums/account.enum'

const createAccountService = async (type: AccountType, data: any): Promise<number | null> => {
  try {
    let query: string
    let params: any[]
    switch (type) {
      case AccountType.email:
        query = 'INSERT INTO accounts(email, password, created_at) VALUES(?, ?, ?)'
        params = [data.email, data.password, data.date]
        break
      case AccountType.google:
        query = 'INSERT INTO accounts(ggid, created_at) VALUES(?, ?)'
        params = [data.ggid, data.date]
        break
      case AccountType.facebook:
        query = 'INSERT INTO accounts(fbid, created_at) VALUES(?, ?)'
        params = [data.fbid, data.date]
        break
    }

    if (query && params) {
      const response = await executeQuery<any>(query, params)
      return parseInt(response.insertId)
    }
    return null
  } catch (error) {
    logging.error('Create account service has error', error)
    throw error
  }
}

export default createAccountService
