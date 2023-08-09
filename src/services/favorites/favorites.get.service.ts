import { executeQuery } from '../../configs/database.config'
import { KahootSummary } from '../../types/kahoot.type'
import logging from '../../utils/logging.util'

const getFavoriteKahootsService = async ({
  userId,
  limit,
  offset
}: {
  userId: number
  limit: number
  offset: number
}): Promise<KahootSummary[] | undefined> => {
  try {
    const query = `SELECT kahoots.id, kahoots.cover_image AS coverImage, kahoots.title, kahoots.created_at as createdAt, 
      kahoots.visible_scope as visibleScope, kahoots.user_id as userId, users.username, users.image as userImage, 
      COUNT(questions.id) AS numberOfQuestion, favorite_kahoots.id AS favoriteId
      FROM questions, users
      LEFT JOIN (kahoots, favorite_kahoots) ON (favorite_kahoots.user_id = ? AND kahoots.id = favorite_kahoots.kahoot_id)
      WHERE questions.kahoot_id = kahoots.id AND users.id = kahoots.user_id AND kahoots.id IN 
      (
        SELECT kahoot_id FROM favorite_kahoots
        WHERE user_id = ?
      )
      GROUP BY kahoots.id
      ORDER BY favoriteId DESC
      LIMIT ? OFFSET ?`
    const params = [userId, userId, limit, offset]
    return executeQuery<KahootSummary[]>(query, params)
  } catch (error) {
    logging.error('Get favorite kahoots service has error:', error)
    throw error
  }
}

export default getFavoriteKahootsService
