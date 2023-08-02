import logging from '../../utils/logging.util'
import { VisibleScope } from '../../enums/kahoot.enum'
import { executeQuery } from '../../configs/database.config'
import { SummaryUserKahoot, SummaryPublicKahoot } from '../../types/kahoot.type'

const getKahootsService = async (args: {
  userId?: number
  scope?: VisibleScope
  offset: number
  limit: number
}): Promise<SummaryUserKahoot[] | SummaryPublicKahoot[] | undefined> => {
  try {
    // Get by user id
    if (args.userId) {
      const query = `SELECT kahoots.id, kahoots.cover_image AS coverImage, kahoots.title, kahoots.created_at as createdAt, kahoots.visible_scope as visibleScope, COUNT(questions.id) AS numberOfQuestion
				FROM kahoots, questions
				WHERE kahoots.user_id = ? AND questions.kahoot_id = kahoots.id
				GROUP BY kahoots.id
				LIMIT ? OFFSET ?`
      const params = [args.userId, args.limit, args.offset]
      return await executeQuery<SummaryUserKahoot[]>(query, params)
    }

    // Get by scope
    if (args.scope) {
      const query = `SELECT kahoots.id, kahoots.cover_image AS coverImage, kahoots.title, kahoots.user_id as userId, users.username, users.image as userImage, COUNT(questions.id) AS numberOfQuestion
				FROM kahoots, questions, users
				WHERE kahoots.visible_scope=? AND questions.kahoot_id = kahoots.id AND users.id = kahoots.user_id
				GROUP BY kahoots.id
				LIMIT ? OFFSET ?`
      const params = [args.scope, args.limit, args.offset]
      return await executeQuery<SummaryPublicKahoot[]>(query, params)
    }
  } catch (error) {
    logging.error('Get kahoots service has error', error)
    throw error
  }
}

export default getKahootsService
