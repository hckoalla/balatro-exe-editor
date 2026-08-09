import AdmZip from 'adm-zip'
import { locateEmbeddedZip } from './locate-embedded-zip'

const GAME_LUA_ENTRY = 'game.lua'

/**
 * Regrava `game.lua` dentro do ZIP embutido num `.exe` fusionado, preservando o stub binário
 * byte-a-byte e todo o resto do conteúdo do ZIP. Equivalente automatizado de arrastar o arquivo
 * editado de volta pro 7-Zip.
 */
export function updateGameLuaInExe(exeBuffer: Buffer, newGameLua: string): Buffer {
  const zipStartOffset = locateEmbeddedZip(exeBuffer)
  const stub = exeBuffer.subarray(0, zipStartOffset)
  const zip = new AdmZip(exeBuffer.subarray(zipStartOffset))

  // `addFile` atualiza a entrada no lugar quando ela já existe, sem tocar nas demais.
  zip.addFile(GAME_LUA_ENTRY, Buffer.from(newGameLua, 'utf-8'))

  return Buffer.concat([stub, zip.toBuffer()])
}
