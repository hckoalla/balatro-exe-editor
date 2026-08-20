import { describe, expect, it } from 'vitest'
import { parseVdfLibraryPaths } from './parse-vdf-library-paths'

// Conteúdo real de libraryfolders.vdf, capturado da máquina do usuário (ver bee8-detectar-instalacao-steam).
const REAL_VDF = `"libraryfolders"
{
	"0"
	{
		"path"		"C:\\\\Program Files (x86)\\\\Steam"
		"label"		""
		"contentid"		"1412568666409268592"
		"totalsize"		"0"
		"update_clean_bytes_tally"		"410651869"
		"time_last_update_verified"		"1786977299"
		"apps"
		{
			"228980"		"215019902"
			"2379780"		"66662933"
		}
	}
}
`

describe('parseVdfLibraryPaths', () => {
  it('extracts the path of every top-level library, unescaping double backslashes', () => {
    expect(parseVdfLibraryPaths(REAL_VDF)).toEqual(['C:\\Program Files (x86)\\Steam'])
  })

  it('extracts multiple libraries when more than one is configured', () => {
    const multiLibraryVdf = `"libraryfolders"
{
	"0"
	{
		"path"		"C:\\\\Program Files (x86)\\\\Steam"
		"apps"
		{
			"228980"		"1"
		}
	}
	"1"
	{
		"path"		"D:\\\\SteamLibrary"
		"apps"
		{
			"2379780"		"66662933"
		}
	}
}
`
    expect(parseVdfLibraryPaths(multiLibraryVdf)).toEqual([
      'C:\\Program Files (x86)\\Steam',
      'D:\\SteamLibrary',
    ])
  })

  it('returns an empty array for malformed/unexpected content, without throwing', () => {
    expect(parseVdfLibraryPaths('not a vdf file at all')).toEqual([])
  })
})
