import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import NpmService from '#services/npm_service'
import PnpmService from '#services/pnpm_service'
import PostgresqlService from '#services/postgresql_service'
import MysqlService from '#services/mysql_service'
import RedisService from '#services/redis_service'
import LinuxService from '#services/linux_service'

export default class DependenciesController {
  @inject()
  async handle(
    ctx: HttpContext,
    npmService: NpmService,
    pnpmService: PnpmService,
    postgresqlService: PostgresqlService,
    mysqlService: MysqlService,
    redisService: RedisService,
    linuxService: LinuxService,
  ) {
    const dependencies = [
      await linuxService.version(),
      await postgresqlService.version(),
      await mysqlService.version(),
      await redisService.version(),
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
