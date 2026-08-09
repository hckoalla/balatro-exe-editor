// Contrato de IPC compartilhado entre main (electron/) e renderer (src/) — única fonte de
// verdade pros nomes de canal e pros tipos de payload/retorno, pra main e preload nunca
// divergirem silenciosamente.

export const IPC_CHANNELS = {
  getAppVersion: 'app:get-version',
} as const

export interface BalatroApi {
  getAppVersion: () => Promise<string>
}
