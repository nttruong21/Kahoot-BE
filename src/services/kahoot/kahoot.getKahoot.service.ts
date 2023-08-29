import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { Kahoot } from '../../models/kahoot.model'

const getKahootService = async (args: {
  kahootId?: number
  userId?: number
  assignmentId?: number
  playId?: number
}): Promise<Kahoot | null> => {
  try {
    if (args.userId) {
      const query =
        'SELECT kahoots.id, user_id as userId, users.username, users.image as userImage, cover_image as coverImage, title, theme, description, media, visible_scope as visibleScope FROM kahoots, users WHERE kahoots.id = ? AND user_id = ? AND users.id = kahoots.user_id LIMIT 1'
      const params = [args.kahootId, args.userId]
      const response = await executeQuery<Kahoot[]>(query, params)
      return response ? response[0] : null
    }

    if (args.assignmentId) {
      const query = `SELECT kahoots.id, kahoots.user_id as userId, users.username, users.image as userImage, cover_image as coverImage, title, theme, description, media, visible_scope as visibleScope 
        FROM kahoots, users, assignments 
        WHERE assignments.id = ? AND assignments.kahoot_id = kahoots.id AND users.id = kahoots.user_id LIMIT 1`
      const params = [args.assignmentId]
      const response = await executeQuery<Kahoot[]>(query, params)
      return response ? response[0] : null
    }

    if (args.playId) {
      const query = `SELECT kahoots.id, user_id as userId, users.username, users.image as userImage, cover_image as coverImage, title, theme, description, media, visible_scope as visibleScope 
        FROM kahoots, users, plays 
        WHERE plays.id = ? AND plays.kahoot_id = kahoots.id AND users.id = kahoots.user_id LIMIT 1`
      const params = [args.playId]
      const response = await executeQuery<Kahoot[]>(query, params)
      return response ? response[0] : null
    }

    const query =
      'SELECT kahoots.id, user_id as userId, users.username, users.image as userImage, cover_image as coverImage, title, theme, description, media, visible_scope as visibleScope FROM kahoots, users WHERE kahoots.id = ? AND users.id = kahoots.user_id LIMIT 1'
    const params = [args.kahootId]
    const response = await executeQuery<Kahoot[]>(query, params)
    return response ? response[0] : null
  } catch (error) {
    logging.error('Get kahoot service has error', error)
    throw error
  }
}

export default getKahootService
