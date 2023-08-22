import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Response {
  id: number
}

const getUserIdsService = async ({ usernames }: { usernames: string[] }) => {
  try {
    let query = 'SELECT id from users WHERE username IN('
    const params: string[] = []
    usernames.forEach((username, index) => {
      query += index === 0 ? '?' : ',?'
      params.push(username)
    })
    query += ')'
    const response = await executeQuery<Response[]>(query, params)
    return response.map((item) => parseInt(item.id.toString()))
  } catch (error) {
    logging.error('Get user ids service has error:', error)
    throw error
  }
}

export default getUserIdsService
