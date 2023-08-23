import { executeQuery } from '../../configs/database.config'
import { KahootSummary } from '../../types/kahoot.type'
import logging from '../../utils/logging.util'

const getSharedKahootsService = async ({
  userId,
  limit,
  offset
}: {
  userId: number
  limit: number
  offset: number
}): Promise<KahootSummary[] | undefined> => {
  try {
    const query = `
      SELECT kahoots.id, kahoots.cover_image AS coverImage, kahoots.title, kahoots.created_at as createdAt, 
          kahoots.visible_scope as visibleScope, kahoots.user_id as userId, users.username, users.image as userImage, 
          COUNT(questions.id) AS numberOfQuestion, shared_kahoots.id AS sharedKahootId
      FROM questions, users
      LEFT JOIN (kahoots, shared_kahoots) ON (shared_kahoots.shared_user_id = ? AND kahoots.id = shared_kahoots.kahoot_id)
      WHERE questions.kahoot_id = kahoots.id AND users.id = kahoots.user_id AND kahoots.id IN 
       (
          SELECT kahoot_id FROM shared_kahoots
          WHERE shared_user_id = ?
       )
      GROUP BY kahoots.id
      ORDER BY sharedKahootId DESC
      LIMIT ? OFFSET ?`
    const params = [userId, userId, limit, offset]
    return executeQuery<KahootSummary[]>(query, params)
  } catch (error) {
    logging.error('Get shared kahoots service has error:', error)
    throw error
  }
}

export default getSharedKahootsService
