import type Configure from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  /**
   * Create default config file
   */
  await codemods.makeUsingStub(stubsRoot, 'config.ts.stub', {})

  /**
   * Register provider
   */
  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@opsone/stalker/stalker_provider')
  })
}
