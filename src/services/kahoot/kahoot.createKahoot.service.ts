import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'
import { Kahoot } from '../../models/kahoot.model'

const createKahootService = async (kahoot: Kahoot): Promise<number | null> => {
  try {
    const query =
      'INSERT INTO kahoots(user_id, cover_image, title, theme, description, media, visible_scope, language, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'
    const params = [
      kahoot.userId,
      kahoot.coverImage,
      kahoot.title,
      kahoot.theme,
      kahoot.description,
      kahoot.media,
      kahoot.visibleScope,
      kahoot.language,
      new Date()
    ]
    const response = await executeQuery<any>(query, params)
    return response ? parseInt(response.insertId) : null
  } catch (error) {
    logging.error('Create kahoot service has error', error)
    throw error
  }
}

export default createKahootService
