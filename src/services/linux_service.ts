import fs from 'node:fs/promises'
import BaseService from './base_service.js'

export default class LinuxService extends BaseService {
  async isEnabled(): Promise<boolean> {
    return fs.access('/etc/os-release').then(() => true).catch(() => false)
  }

  async version() {
    if (!await this.isEnabled()) {
      return
    }

    // Check if Debian
    const isDebian = await fs.access('/etc/debian_version').then(() => true).catch(() => false)

    if (isDebian) {
      const version = (await fs.readFile('/etc/debian_version', 'utf-8')).trim()
      return [
        { name: 'debian', dep_type: 'os', version }
      ]
    }

    // Parse /etc/os-release (format: KEY=value or KEY="value")
    const content = await fs.readFile('/etc/os-release', 'utf-8')
    const osRelease = this.parseOsRelease(content)

    return [
      { 
        name: osRelease.ID || 'unknown', 
        dep_type: 'os', 
        version: osRelease.VERSION_ID || 'unknown' 
      }
    ]
  }

  private parseOsRelease(content: string): Record<string, string> {
    const result: Record<string, string> = {}
    
    for (const line of content.split('\n')) {
      const match = line.match(/^(\w+)=["']?([^"'\n]*)["']?$/)
      if (match) {
        result[match[1]] = match[2]
      }
    }
    
    return result
  }
}