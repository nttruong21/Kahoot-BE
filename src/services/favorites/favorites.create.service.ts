import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const createFavoriteKahootService = async ({
  userId,
  kahootId
}: {
  userId: number
  kahootId: number
}): Promise<number> => {
  try {
    const query = 'INSERT INTO favorite_kahoots (user_id, kahoot_id) VALUES (?, ?)'
    const params = [userId, kahootId]
    const response = await executeQuery<any>(query, params)
    return parseInt(response.insertId)
  } catch (error) {
    logging.error('Create favorite kahoot service has error:', error)
    throw error
  }
}

export default createFavoriteKahootService
