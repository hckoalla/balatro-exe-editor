import { extractFileFromExe } from '../exe-engine/extract-file-from-exe'

const CONSUMABLE_ATLAS_ENTRY = 'resources/textures/1x/Tarots.png'

type ReadFileFn = (path: string) => Promise<Buffer>

/**
 * Extrai o atlas de sprites dos consumíveis (Tarot/Planet/Spectral) do próprio `.exe`
 * selecionado pelo usuário, como data URL — nenhum asset proprietário do jogo é empacotado no
 * instalador (ver bee5-imagens-consumiveis). Nunca lança: se o atlas não existir/não puder ser
 * lido, resolve pra `null`, e a UI cai pro fallback de mostrar só o nome.
 */
export async function getConsumableAtlasFromExe(
  exePath: string,
  readFileFn: ReadFileFn,
): Promise<string | null> {
  const exeBuffer = await readFileFn(exePath)

  try {
    const atlasBuffer = extractFileFromExe(exeBuffer, CONSUMABLE_ATLAS_ENTRY)
    return `data:image/png;base64,${atlasBuffer.toString('base64')}`
  } catch {
    return null
  }
}
