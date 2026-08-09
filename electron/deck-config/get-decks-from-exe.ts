import type { ParsedDeck } from '../../src/shared/deck-schema'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { parseDeckBlock } from './parse-deck-block'

type ReadFileFn = (path: string) => Promise<Buffer>

export async function getDecksFromExe(
  exePath: string,
  readFileFn: ReadFileFn,
): Promise<ParsedDeck[]> {
  const exeBuffer = await readFileFn(exePath)
  const gameLua = extractGameLua(exeBuffer)
  return parseDeckBlock(gameLua)
}
