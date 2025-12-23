import fs from 'node:fs/promises'
import { $ } from 'execa'

import BaseService from './base_service.js'

export default class NpmService extends BaseService {
  async isEnabled(): Promise<boolean> {
    return fs
      .access('package-lock.json')
      .then(() => true)
      .catch(() => false)
  }

  async version() {
    if (!(await this.isEnabled())) {
      return
    }

    const { stdout } = await $`${this.config.npmBin!} -v`

    return [
      { name: 'node', dep_type: 'node', version: process.version.replace('v', '') },
      { name: 'npm', dep_type: 'npm', version: stdout.trim() },
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

    // Run npm list --depth=0 (ignore exit code, npm returns 1 on peer dep issues)
    const { stdout } = await $({ reject: false })`${this.config.npmBin!} list --depth=0`

    // Parse each line and extract packages
    const regex = /^[├└]── (.+)@([\d.]+)$/

    return stdout
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => regex.test(line))
      .map((line) => {
        const match = line.match(regex)!
        const [, name, version] = match
        return { name, dep_type: 'node_module', version }
      })
      .filter((pkg) => pkg.name in specs)
  }
}
