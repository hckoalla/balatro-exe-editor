import { describe, expect, it } from 'vitest'
import { detectBalatroViaSteam } from './detect-balatro-via-steam'

const VDF_ONE_LIBRARY = `"libraryfolders"
{
	"0"
	{
		"path"		"C:\\\\Program Files (x86)\\\\Steam"
		"apps"
		{
			"2379780"		"66662933"
		}
	}
}
`

const ACF = `"AppState"
{
	"appid"		"2379780"
	"installdir"		"Balatro"
}
`

function join(...parts: string[]) {
  return parts.join('\\')
}

describe('detectBalatroViaSteam', () => {
  it('walks the full chain and finds Balatro.exe when everything checks out', async () => {
    const result = await detectBalatroViaSteam({
      getSteamPath: async () => 'C:\\Program Files (x86)\\Steam',
      readFile: async (path) => {
        if (path.endsWith('libraryfolders.vdf')) return VDF_ONE_LIBRARY
        if (path.endsWith('appmanifest_2379780.acf')) return ACF
        throw new Error(`unexpected readFile(${path})`)
      },
      fileExists: async (path) =>
        path === join('C:\\Program Files (x86)\\Steam', 'steamapps', 'common', 'Balatro', 'Balatro.exe'),
    })

    expect(result).toBe(
      join('C:\\Program Files (x86)\\Steam', 'steamapps', 'common', 'Balatro', 'Balatro.exe'),
    )
  })

  it('resolves to null when Steam is not installed (no registry key)', async () => {
    const result = await detectBalatroViaSteam({
      getSteamPath: async () => null,
      readFile: async () => {
        throw new Error('should not be called')
      },
      fileExists: async () => {
        throw new Error('should not be called')
      },
    })

    expect(result).toBeNull()
  })

  it('resolves to null when Balatro is not installed in any library', async () => {
    const result = await detectBalatroViaSteam({
      getSteamPath: async () => 'C:\\Program Files (x86)\\Steam',
      readFile: async (path) => {
        if (path.endsWith('libraryfolders.vdf')) return VDF_ONE_LIBRARY
        throw new Error('appmanifest not found') // sem appmanifest_2379780.acf nessa biblioteca
      },
      fileExists: async () => false,
    })

    expect(result).toBeNull()
  })

  it('resolves to null (not throw) when the exe path resolved but the file does not actually exist', async () => {
    const result = await detectBalatroViaSteam({
      getSteamPath: async () => 'C:\\Program Files (x86)\\Steam',
      readFile: async (path) => {
        if (path.endsWith('libraryfolders.vdf')) return VDF_ONE_LIBRARY
        if (path.endsWith('appmanifest_2379780.acf')) return ACF
        throw new Error(`unexpected readFile(${path})`)
      },
      fileExists: async () => false,
    })

    expect(result).toBeNull()
  })
})
