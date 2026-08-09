import { extractGameLua } from './extract-game-lua'

export interface ValidateBalatroExeResult {
  valid: boolean
  reason: string | null
}

type ReadFileFn = (path: string) => Promise<Buffer>

/**
 * Confirma que o arquivo em `filePath` é um `.exe` fusionado válido do Balatro (contém
 * `game.lua` dentro do ZIP embutido). Nunca lança — sempre retorna um resultado, pra UI mostrar
 * uma mensagem específica sem precisar de try/catch.
 */
export async function validateBalatroExe(
  filePath: string,
  readFileFn: ReadFileFn,
): Promise<ValidateBalatroExeResult> {
  let buffer: Buffer
  try {
    buffer = await readFileFn(filePath)
  } catch {
    return { valid: false, reason: `Could not read "${filePath}".` }
  }

  try {
    extractGameLua(buffer)
    return { valid: true, reason: null }
  } catch (error) {
    return { valid: false, reason: error instanceof Error ? error.message : 'Invalid file.' }
  }
}
