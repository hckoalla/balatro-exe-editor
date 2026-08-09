import AdmZip from 'adm-zip'

// PK\x05\x06, little-endian.
const EOCD_SIGNATURE = 0x06054b50
const EOCD_MIN_SIZE = 22
const MAX_ZIP_COMMENT_SIZE = 0xffff

/**
 * Localiza o offset onde o ZIP embutido começa dentro de um `.exe` fusionado do LÖVE2D
 * (`[stub binário][ZIP]`). Acha o End Of Central Directory (EOCD) escaneando de trás pra frente
 * e usa o offset relativo do central directory nele guardado pra descontar o tamanho do stub —
 * o mesmo truque usado por ferramentas de SFX/self-extracting archive.
 */
export function locateEmbeddedZip(exeBuffer: Buffer): number {
  const eocdOffset = findEocdOffset(exeBuffer)
  if (eocdOffset === -1) {
    throw new Error(
      'No ZIP end-of-central-directory record found — this does not look like a fused LÖVE2D executable.',
    )
  }

  const centralDirectorySize = exeBuffer.readUInt32LE(eocdOffset + 12)
  const centralDirectoryOffset = exeBuffer.readUInt32LE(eocdOffset + 16)
  const zipStartOffset = eocdOffset - centralDirectorySize - centralDirectoryOffset

  if (zipStartOffset < 0 || zipStartOffset > eocdOffset) {
    throw new Error(
      'The ZIP end-of-central-directory record is inconsistent with the file — the embedded ZIP looks corrupted.',
    )
  }

  // Confirma que os bytes a partir do offset encontrado realmente formam um ZIP válido, não só
  // que a aritmética do EOCD fechou por coincidência.
  try {
    new AdmZip(exeBuffer.subarray(zipStartOffset))
  } catch (cause) {
    throw new Error('The embedded ZIP could not be read — the file looks corrupted.', { cause })
  }

  return zipStartOffset
}

function findEocdOffset(buffer: Buffer): number {
  const searchFloor = Math.max(0, buffer.length - EOCD_MIN_SIZE - MAX_ZIP_COMMENT_SIZE)

  for (let offset = buffer.length - EOCD_MIN_SIZE; offset >= searchFloor; offset--) {
    if (buffer.readUInt32LE(offset) === EOCD_SIGNATURE) {
      return offset
    }
  }

  return -1
}
