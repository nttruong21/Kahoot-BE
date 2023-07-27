import logging from '../../utils/logging.util'
import { executeQuery } from '../../configs/database.config'

const deleteKahootService = async (args: { kahootId?: number }) => {
  try {
    const query = 'DELETE FROM kahoots WHERE id = ?'
    const params = [args.kahootId]
    return await executeQuery<void>(query, params)
  } catch (error) {
    logging.error('Delete kahoot service has error', error)
    throw error
  }
}

export default deleteKahootService
