import { describe, expect, it } from 'vitest'
import { getSteamPathFromRegistry } from './get-steam-path-from-registry'

describe('getSteamPathFromRegistry', () => {
  it('parses the SteamPath value from real "reg query" output', async () => {
    const execFn = async () => ({
      stdout:
        'HKEY_CURRENT_USER\\Software\\Valve\\Steam\r\n    SteamPath    REG_SZ    c:/program files (x86)/steam\r\n\r\n',
    })

    await expect(getSteamPathFromRegistry(execFn)).resolves.toBe(
      'c:/program files (x86)/steam',
    )
  })

  it('resolves to null (not throw) when the registry key does not exist', async () => {
    const execFn = async () => {
      throw new Error('ERROR: The system was unable to find the specified registry key or value.')
    }

    await expect(getSteamPathFromRegistry(execFn)).resolves.toBeNull()
  })
})
