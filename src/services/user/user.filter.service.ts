import { executeQuery } from '../../configs/database.config'
import logging from '../../utils/logging.util'

interface User {
  id: number
  username: string
  name: string
  image: string
}

const filterUsersService = async ({ keyword, currentUserId }: { keyword: string; currentUserId: number }) => {
  try {
    const query = 'SELECT id, username, name, image FROM users WHERE username LIKE (?) AND id != ?'
    const params = [`%${keyword}%`, currentUserId]
    const response = await executeQuery<User[]>(query, params)
    return response ? response : null
  } catch (error) {
    logging.error('Filter users service has error:', error)
    throw error
  }
}

export default filterUsersService
