import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { Kahoot } from '../../models/kahoot.model'

const getKahootService = async (args: { kahootId: number; userId?: number }): Promise<Kahoot | null> => {
  try {
    const query = args.userId
      ? 'SELECT kahoots.id, user_id as userId, users.username, users.image as userImage, cover_image as coverImage, title, theme, description, media, visible_scope as visibleScope FROM kahoots, users WHERE kahoots.id = ? AND user_id = ? AND users.id = kahoots.user_id LIMIT 1'
      : 'SELECT kahoots.id, user_id as userId, users.username, users.image as userImage, cover_image as coverImage, title, theme, description, media, visible_scope as visibleScope FROM kahoots, users WHERE kahoots.id = ? AND users.id = kahoots.user_id LIMIT 1'
    const params = args.userId ? [args.kahootId, args.userId] : [args.kahootId]
    const response = await executeQuery<Kahoot[]>(query, params)
    return response[0] ?? null
  } catch (error) {
    logging.error('Get kahoot by id service has error', error)
    throw error
  }
}

export default getKahootService
