import logging from '../../utils/logging.util'
import { VisibleScope } from '../../enums/kahoot.enum'
import { executeQuery } from '../../configs/database.config'
import { KahootSummary } from '../../types/kahoot.type'

const getKahootsService = async (args: {
  sessionUserId: number | null
  userId?: number
  scope?: VisibleScope
  offset: number
  limit: number
}): Promise<KahootSummary[] | null> => {
  try {
    // Get by user id
    if (args.userId) {
      const query = `SELECT kahoots.id, kahoots.cover_image AS coverImage, kahoots.title, kahoots.created_at as createdAt, kahoots.visible_scope as visibleScope, kahoots.user_id as userId, users.username, users.image as userImage, COUNT(questions.id) AS numberOfQuestion
				FROM questions
        LEFT JOIN (users, kahoots) ON (kahoots.user_id = ? AND kahoots.user_id = users.id) 
				WHERE questions.kahoot_id = kahoots.id
				GROUP BY kahoots.id
        LIMIT ? OFFSET ?`
      const params = [args.userId, args.limit, args.offset]
      return await executeQuery<KahootSummary[]>(query, params)
    }

    // Get by scope
    if (args.scope) {
      const query = `SELECT kahoots.id, kahoots.cover_image AS coverImage, kahoots.title, kahoots.created_at as createdAt, kahoots.visible_scope as visibleScope, kahoots.user_id as userId, users.username, users.image as userImage, COUNT(questions.id) AS numberOfQuestion
        FROM questions
        LEFT JOIN (users, kahoots) ON (kahoots.visible_scope = ? AND kahoots.user_id = users.id AND kahoots.user_id != ?)
				WHERE questions.kahoot_id = kahoots.id 
				GROUP BY kahoots.id
				LIMIT ? OFFSET ?`
      const params = [args.scope, args.sessionUserId, args.limit, args.offset]
      return await executeQuery<KahootSummary[]>(query, params)
    }

    // Get by scope and user id
    if (args.scope && args.userId) {
      const query = `SELECT kahoots.id, kahoots.cover_image AS coverImage, kahoots.title, kahoots.created_at as createdAt, kahoots.visible_scope as visibleScope, kahoots.user_id as userId, users.username, users.image as userImage, COUNT(questions.id) AS numberOfQuestion
        FROM questions
        LEFT JOIN (users, kahoots) ON (kahoots.visible_scope = ? AND kahoots.user_id = ? AND kahoots.user_id = users.id)
				WHERE questions.kahoot_id = kahoots.id
				GROUP BY kahoots.id
				LIMIT ? OFFSET ?`
      const params = [args.scope, args.userId, args.limit, args.offset]
      return await executeQuery<KahootSummary[]>(query, params)
    }

    return null
  } catch (error) {
    logging.error('Get kahoots service has error', error)
    throw error
  }
}

export default getKahootsService
