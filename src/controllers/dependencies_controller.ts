import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import NpmService from '#services/npm_service'
import PnpmService from '#services/pnpm_service'

export default class DependenciesController {
  @inject()
  async handle(ctx: HttpContext, npmService: NpmService, pnpmService: PnpmService) {
    const dependencies = [
      await npmService.version(),
      await npmService.getDependencies(),
      await pnpmService.version(),
      await pnpmService.getDependencies(),
    ]
      .flat()
      .filter((d) => !!d)

    const unique = [...new Map(dependencies.map((d) => [d.name, d])).values()]

    return ctx.response.json(unique)
  }
}
