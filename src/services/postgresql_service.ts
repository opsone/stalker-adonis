import type { DatabaseConfig } from '@adonisjs/lucid/types/database'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'

import BaseService from './base_service.js'

export default class PostgresqlService extends BaseService {
  async isEnabled(): Promise<boolean> {
    const config = app.config.get<DatabaseConfig>('database')
    const connectionName = config.connection
    const connectionConfig = config.connections[connectionName]
    
    return connectionConfig.client === 'pg' || connectionConfig.client === 'postgres' || connectionConfig.client === 'postgresql'
  }

  async version() {
    if (!await this.isEnabled()) {
      return
    }

    const result = await db.rawQuery('SELECT version()')
    const fullVersion = result.rows[0].version as string
    
    const match = fullVersion.match(/PostgreSQL (\d+\.\d+)/)
    const version = match ? match[1] : fullVersion

    return [
      { name: 'postgresql', dep_type: 'db_server', version }
    ]
  }
}