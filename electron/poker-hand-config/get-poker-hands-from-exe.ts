import type { ParsedPokerHand } from '../../src/shared/poker-hand-schema'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { parsePokerHandsBlock } from './parse-poker-hands-block'

type ReadFileFn = (path: string) => Promise<Buffer>

export async function getPokerHandsFromExe(
  exePath: string,
  readFileFn: ReadFileFn,
): Promise<ParsedPokerHand[]> {
  const exeBuffer = await readFileFn(exePath)
  const gameLua = extractGameLua(exeBuffer)
  return parsePokerHandsBlock(gameLua)
}
