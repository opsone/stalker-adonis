import type StalkerManager from '../src/stalker_manager.js'
import app from '@adonisjs/core/services/app'

let manager: StalkerManager

await app.booted(async () => {
  manager = await app.container.make('opsone.stalker')
})

export { manager as default }
