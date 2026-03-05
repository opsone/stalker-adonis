import type { StalkerConfig } from './types/config.js'

export function defineConfig<T extends StalkerConfig>(config: T): T {
  return {
    npmBin: 'npm',
    pnpmBin: 'pnpm',
    ...config,
  }
}
