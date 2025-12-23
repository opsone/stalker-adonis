import type { StalkerConfig } from '../types/config.js'

import app from '@adonisjs/core/services/app'

export default class BaseService {
  config: StalkerConfig

  constructor() {
    this.config = app.config.get('stalker', {})
  }

  async isEnabled(): Promise<boolean> {
    return true
  }
}
