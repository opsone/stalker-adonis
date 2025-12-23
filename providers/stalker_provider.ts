import type { ApplicationService } from '@adonisjs/core/types'
import type { RouteGroup } from '@adonisjs/core/http'
import type { StalkerConfig } from '../src/types/config.js'
import StalkerManager from '../src/stalker_manager.js'

export default class StalkerProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('opsone.stalker', async () => {
      const config = this.app.config.get<StalkerConfig>('stalker', {})
      return new StalkerManager(config)
    })
  }

  async start() {
    const router = await this.app.container.make('router')
    const DependenciesController = () => import('../src/controllers/dependencies_controller.js')

    router.stalker = (pattern: string = '/stalker') => {
      return router.group(() => {
        router.get(pattern, [DependenciesController])
      })
    }
  }
}

declare module '@adonisjs/core/http' {
  interface Router {
    stalker: (pattern?: string) => RouteGroup
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'opsone.stalker': StalkerManager
  }
}
