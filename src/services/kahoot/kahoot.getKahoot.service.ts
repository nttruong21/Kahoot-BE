import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { Kahoot } from '../../models/kahoot.model'

const getKahootService = async (args: { kahootId: number; userId?: number }): Promise<Kahoot | null> => {
  try {
    const query = args.userId
      ? 'SELECT id, user_id as userId, cover_image as coverImage, title, theme, description, media, visible_scope as visibleScope FROM kahoots WHERE id = ? AND user_id = ? LIMIT 1'
      : 'SELECT id, user_id as userId, cover_image as coverImage, title, theme, description, media, visible_scope as visibleScope FROM kahoots WHERE id = ? LIMIT 1'
    const params = args.userId ? [args.kahootId, args.userId] : [args.kahootId]
    const response = await executeQuery<Kahoot[]>(query, params)
    return response[0] ?? null
  } catch (error) {
    logging.error('Get kahoot by id service has error', error)
    throw error
  }
}

export default getKahootService
