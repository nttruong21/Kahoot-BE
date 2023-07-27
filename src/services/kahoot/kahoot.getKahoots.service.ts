import logging from '../../utils/logging.util'
import { VisibleScope } from '../../enums/kahoot.enum'
import { executeQuery } from '../../configs/database.config'

interface GetOwnKahootResponse {
  id: number
  title: string
  coverImage: string
  numberOfQuestion: number
}

interface GetPublicKahootResponse extends GetOwnKahootResponse {
  userId: number
  username: string
  userImage: string
}

const getKahootsService = async (args: {
  userId?: number
  scope?: VisibleScope
  offset: number
  limit: number
}): Promise<GetOwnKahootResponse[] | GetPublicKahootResponse[] | undefined> => {
  try {
    // Get by user id
    if (args.userId) {
      const query = `SELECT kahoots.id, kahoots.cover_image AS coverImage, kahoots.title, COUNT(questions.id) AS numberOfQuestion
				FROM kahoots, questions
				WHERE kahoots.user_id = ? AND questions.kahoot_id = kahoots.id
				GROUP BY kahoots.id
				LIMIT ? OFFSET ?`
      const params = [args.userId, args.limit, args.offset]
      return await executeQuery<GetPublicKahootResponse[]>(query, params)
    }

    // Get by scope
    if (args.scope) {
      const query = `SELECT kahoots.id, kahoots.cover_image AS coverImage, kahoots.title, kahoots.user_id as userId, users.username, users.image as userImage, COUNT(questions.id) AS numberOfQuestion
				FROM kahoots, questions, users
				WHERE kahoots.visible_scope=? AND questions.kahoot_id = kahoots.id
				GROUP BY kahoots.id
				LIMIT ? OFFSET ?`
      const params = [args.scope, args.limit, args.offset]
      return await executeQuery<GetOwnKahootResponse[]>(query, params)
    }
  } catch (error) {
    logging.error('Get kahoots service has error', error)
    throw error
  }
}

export default getKahootsService
