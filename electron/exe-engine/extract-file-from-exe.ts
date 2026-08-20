import AdmZip from 'adm-zip'
import { locateEmbeddedZip } from './locate-embedded-zip'

/**
 * Extrai uma entrada arbitrária de dentro do ZIP embutido num `.exe` fusionado do LÖVE2D, pelo
 * caminho exato dela no ZIP (ex: `resources/textures/1x/Tarots.png`) — versão genérica de
 * `extractGameLua`, usada pra ler assets do próprio `.exe` do usuário em vez de empacotar cópias
 * proprietárias no instalador (ver bee5-imagens-consumiveis).
 */
export function extractFileFromExe(exeBuffer: Buffer, entryPath: string): Buffer {
  const zipStartOffset = locateEmbeddedZip(exeBuffer)
  const zip = new AdmZip(exeBuffer.subarray(zipStartOffset))

  const entry = zip.getEntry(entryPath)
  if (!entry) {
    throw new Error(`Entry "${entryPath}" not found inside the embedded ZIP.`)
  }

  return entry.getData()
}
