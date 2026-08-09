import type { IpcMainLike } from '../../electron/ipc/ipc-main-like'

// Deixa handlers de ipcMain testáveis sem precisar de um processo Electron real rodando — ver
// bee1-ipc-bridge-tipado.
export function createFakeIpcMain() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- espelha IpcMainLike['handle']
  const handlers = new Map<string, (event: unknown, ...args: any[]) => unknown>()

  const ipcMain: IpcMainLike = {
    handle(channel, listener) {
      handlers.set(channel, listener)
    },
  }

  // `ipcRenderer.invoke` sempre retorna uma Promise, mesmo se o handler real for síncrono —
  // o fake espelha esse comportamento.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- espelha IpcMainLike['handle']
  async function invoke(channel: string, ...args: any[]) {
    const handler = handlers.get(channel)
    if (!handler) {
      throw new Error(`No handler registered for channel "${channel}"`)
    }
    return handler({}, ...args)
  }

  return { ipcMain, invoke }
}
