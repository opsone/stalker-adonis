import fs from 'node:fs/promises'
import { $ } from 'execa'

import BaseService from './base_service.js'

export default class PnpmService extends BaseService {
  async isEnabled(): Promise<boolean> {
    return fs
      .access('pnpm-lock.yaml')
      .then(() => true)
      .catch(() => false)
  }

  async version() {
    if (!(await this.isEnabled())) {
      return
    }

    const { stdout } = await $`${this.config.pnpmBin!} -v`

    return [
      { name: 'node', dep_type: 'node', version: process.version.replace('v', '') },
      { name: 'pnpm', dep_type: 'pnpm', version: stdout.trim() },
    ]
  }

  async getDependencies() {
    if (!(await this.isEnabled())) {
      return
    }

    // Read package.json and merge dependencies
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'))
    const specs: Record<string, string> = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    }

    const { stdout } = await $({ reject: false })`${this.config.pnpmBin!} list --depth=0 --json`
    const result = JSON.parse(stdout) as {
      dependencies: Record<string, { version: string }>
      devDependencies: Record<string, { version: string }>
    }[]
    const allDeps = {
      ...(result[0].dependencies || {}),
      ...(result[0].devDependencies || {}),
    }

    return Object.entries(allDeps)
      .filter(([name]) => name in specs)
      .map(([name, info]) => ({
        name,
        dep_type: 'node_module',
        version: info.version,
      }))
  }
}
