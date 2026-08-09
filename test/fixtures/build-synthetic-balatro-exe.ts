import AdmZip from 'adm-zip'

// Bytes fake que representam o stub binário do LÖVE2D num .exe fusionado real — só serve pra
// dar ao motor de BEE-3 um prefixo não-ZIP de tamanho conhecido pra pular na hora de localizar o
// ZIP embutido. Não é (e não precisa parecer) um executável de verdade.
export const FIXTURE_STUB = Buffer.from('FIXTURE-LOVE2D-STUB-NOT-REAL\0'.repeat(4), 'utf-8')

// Data fixa (não "agora") pra cada build ser byte-a-byte idêntico dado o mesmo game.lua de entrada.
const DETERMINISTIC_DATE = new Date(0)

/**
 * Monta um `.exe` sintético no mesmo formato do balatro.exe real: um stub binário seguido de um
 * ZIP concatenado contendo `game.lua`. Determinístico — o mesmo `gameLua` sempre produz o mesmo
 * buffer, byte a byte.
 */
export function buildSyntheticBalatroExe(gameLua: string): Buffer {
  const zip = new AdmZip()
  zip.addFile('game.lua', Buffer.from(gameLua, 'utf-8'))
  zip.getEntry('game.lua')!.header.time = DETERMINISTIC_DATE

  return Buffer.concat([FIXTURE_STUB, zip.toBuffer()])
}
