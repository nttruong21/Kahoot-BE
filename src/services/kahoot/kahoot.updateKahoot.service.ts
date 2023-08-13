import logging from '../../utils/logging.util'
import { Kahoot } from '../../models/kahoot.model'
import { executeQuery } from '../../configs/database.config'

const updateKahootService = async (kahoot: Kahoot): Promise<void> => {
  try {
    const query =
      'UPDATE kahoots SET cover_image = ?, title = ?, theme = ?, description = ?, media = ?, visible_scope = ? WHERE id = ?'
    const params = [
      kahoot.coverImage,
      kahoot.title,
      kahoot.theme,
      kahoot.description,
      kahoot.media,
      kahoot.visibleScope,
      kahoot.id
    ]
    return await executeQuery(query, params)
  } catch (error) {
    logging.error('Update kahoot service has error', error)
    throw error
  }
}

export default updateKahootService
