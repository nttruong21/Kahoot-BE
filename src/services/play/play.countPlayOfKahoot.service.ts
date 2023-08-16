import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Response {
  count: number
  kahootId: number
}

const countPlayOfKahootService = async (kahootId: number) => {
  try {
    const query = `
		SELECT COUNT(plays.id) as count, kahoots.id AS kahootId, 
		FROM kahoots, plays 
		WHERE kahoots.id = ? AND plays.kahoot_id = kahoots.id 
		GROUP BY kahoots.id;
		`
    const params = [kahootId]
    const response = await executeQuery<Response[]>(query, params)
    return response && response.length > 0 ? response[0].count : 0
  } catch (error) {
    logging.error('Count play of kahoot service has error:', error)
    throw error
  }
}

export default countPlayOfKahootService
