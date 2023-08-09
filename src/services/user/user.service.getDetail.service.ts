import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface Response {
  id: number
  name: string
  image: string
  numberOfKahoots: number
}

const getUserDetail = async ({ userId }: { userId: number }) => {
  try {
    const query = `
      SELECT users.id, users.name, users.image, COUNT(kahoots.id) AS numberOfKahoots
      FROM users, kahoots
      WHERE kahoots.user_id = users.id AND users.id = ?
      GROUP BY users.id
      `
    const params = [userId]
    const response = await executeQuery<Response[]>(query, params)
    return response ? response[0] : null
  } catch (error) {
    logging.error('Get users list service has error:', error)
    throw error
  }
}
export default getUserDetail