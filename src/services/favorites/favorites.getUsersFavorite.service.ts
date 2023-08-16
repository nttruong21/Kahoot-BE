import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Response {
  userId: number
}

const getUsersFavoriteService = async (kahootId: number) => {
  try {
    const query = `
			SELECT user_id as userId
			FROM favorite_kahoots
			WHERE kahoot_id = ?
		`
    const params = [kahootId]
    const response = await executeQuery<Response[]>(query, params)
    return response
  } catch (error) {
    logging.error('Get users ')
  }
}

export default getUsersFavoriteService
