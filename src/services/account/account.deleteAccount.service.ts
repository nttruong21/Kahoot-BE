import logging from '../../utils/logging.util'

import { executeQuery } from '../../configs/database.config'

const deleteAccountService = async (id: number): Promise<void> => {
  try {
    await executeQuery('DELETE from users WHERE id = ?', [id])
    await executeQuery('DELETE from accounts WHERE id = ?', [id])
  } catch (error) {
    logging.error('Update account password service has error has error', error)
    throw error
  }
}

export default deleteAccountService
