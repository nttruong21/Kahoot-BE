import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

const updateUserService = async ({ username, image, id }: { id: number; username: string; image: string }) => {
  try {
    const query = 'UPDATE users SET username = ?, image = ? WHERE id = ?'
    const params = [username, image, id]
    const response = await executeQuery<any>(query, params)
    return response.affectedRows === 1
  } catch (error) {
    logging.error('Update user service has error:', error)
    throw error
  }
}

export default updateUserService
