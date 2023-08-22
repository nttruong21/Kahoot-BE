import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const shareKahootService = async ({
  kahootId,
  sharerId,
  sharedIds
}: {
  kahootId: number
  sharerId: number
  sharedIds: number[]
}) => {
  try {
    let query = 'INSERT INTO shared_kahoots (kahoot_id, sharer_user_id, shared_user_id) VALUES '
    const params: Array<number | string> = []
    sharedIds.forEach((sharedId, index) => {
      query += index === 0 ? '(?,?,?)' : ',(?,?,?)'
      params.push(...[kahootId, sharerId, sharedId])
    })
    const response = await executeQuery<any>(query, params)
    return response.affectedRows === sharedIds.length
  } catch (error) {
    logging.error('Share kahoot service has error:', error)
    throw error
  }
}

export default shareKahootService
