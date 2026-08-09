import type { ConsumableCatalogEntry } from '../../src/shared/consumable-catalog-schema'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { parseConsumableCatalog } from './parse-consumable-catalog'

type ReadFileFn = (path: string) => Promise<Buffer>

export async function getConsumableCatalogFromExe(
  exePath: string,
  readFileFn: ReadFileFn,
): Promise<ConsumableCatalogEntry[]> {
  const exeBuffer = await readFileFn(exePath)
  const gameLua = extractGameLua(exeBuffer)
  return parseConsumableCatalog(gameLua)
}
