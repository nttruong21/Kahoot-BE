import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const deleteFavoriteKahootService = async ({ userId, kahootId }: { userId: number; kahootId: number }) => {
  try {
    const query = 'DELETE FROM favorite_kahoots WHERE user_id = ? AND kahoot_id = ?'
    const params = [userId, kahootId]
    return await executeQuery<any>(query, params)
  } catch (error) {
    logging.error('Delete favorite kahoot service has error:', error)
    throw error
  }
}

export default deleteFavoriteKahootService
