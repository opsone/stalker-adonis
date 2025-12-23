import type { StalkerConfig } from './types/config.js'

export default class StalkerManager {
  config: StalkerConfig

  constructor(config: StalkerConfig) {
    this.config = config
  }
}
