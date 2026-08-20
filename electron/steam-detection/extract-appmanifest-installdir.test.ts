import { describe, expect, it } from 'vitest'
import { extractAppmanifestInstallDir } from './extract-appmanifest-installdir'

// Conteúdo real de appmanifest_2379780.acf, capturado da máquina do usuário.
const REAL_ACF = `"AppState"
{
	"appid"		"2379780"
	"universe"		"1"
	"LauncherPath"		"C:\\\\Program Files (x86)\\\\Steam\\\\steam.exe"
	"name"		"Balatro"
	"StateFlags"		"4"
	"installdir"		"Balatro"
	"LastUpdated"		"1786242937"
}
`

describe('extractAppmanifestInstallDir', () => {
  it('extracts the installdir field', () => {
    expect(extractAppmanifestInstallDir(REAL_ACF)).toBe('Balatro')
  })

  it('returns null for malformed/unexpected content, without throwing', () => {
    expect(extractAppmanifestInstallDir('not an acf file at all')).toBeNull()
  })
})
