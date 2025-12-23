import app from '@adonisjs/core/services/app'
import BaseService from './base_service.js'

export default class RedisService extends BaseService {
  async isEnabled(): Promise<boolean> {
    try {
      return app.container.hasBinding('redis')
    } catch {
      return false
    }
  }

  async version() {
    if (!await this.isEnabled()) {
      return
    }

    const redis = await app.container.make('redis') as { info: (section: string) => Promise<string> }
    const info = await redis.info('server')
    
    const match = info.match(/redis_version:(\S+)/)
    const version = match ? match[1] : 'unknown'

    return [
      { name: 'redis', dep_type: 'db_server', version }
    ]
  }
}