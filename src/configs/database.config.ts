import mariadb from 'mariadb'

import logging from '../utils/logging.util'

const configs = {
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_NAME,
  port: +process.env.MARIADB_PORT!,
  connectionLimit: 10,
  allowPublicKeyRetrieval: true
}

const pool = mariadb.createPool(configs)

let conn: mariadb.PoolConnection | undefined

export const getConnection = async () => {
  try {
    if (!conn) {
      conn = await pool.getConnection()
      logging.success('[Database] Get connection to database successfully')
    }
    return conn
  } catch (error) {
    logging.error('[Database] Get connection to database failure', error)
    throw error
  }
}

export const executeQuery = async <T>(query: string, params: any[] = []): Promise<T> => {
  try {
    const conn = await getConnection()
    if (!conn) {
      throw 'Can not connect to the database'
    }
    const res = await conn.query<T>(query, params)
    return res
  } catch (error: any) {
    switch (error.code) {
      case 'PROTOCOL_CONNECTION_LOST':
        logging.info('[Database] Try to reconnect to database')
        try {
          conn = undefined
          conn = await getConnection()
          logging.success('[Database] Reconnect to database success')
          const res = await conn?.query(query, params)
          return res
        } catch (error: any) {
          logging.error(`[Database] ${error.message}`)
          return error.code
        }
      case 'ER_CMD_CONNECTION_CLOSED':
        logging.info('[Database] Try to reconnect to database')
        try {
          conn = undefined
          conn = await getConnection()
          logging.success('[Database] Reconnect to database success')
          const res = await conn?.query(query, params)
          return res
        } catch (error: any) {
          logging.error(`[Database] ${error.message}`)
          return error.code
        }
      case 'ER_DUP_ENTRY':
        logging.error(`[Database] ${error.code} : ${error.message}`)
        return error.code
      case 'ER_NO_REFERENCED_ROW_2':
        logging.error(`[Database] ${error.code} : ${error.message}`)
        return error.code
      default:
        logging.error(`[Database] ${error.code} : ${error.message}`)
        return error.code
    }
  } finally {
    conn?.release()
  }
}
