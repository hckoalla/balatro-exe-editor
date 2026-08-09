// Subconjunto de `Electron.IpcMain` usado pelos register-*-handlers. Não usar `Pick<IpcMain,
// 'handle'>` diretamente — a contravariância de parâmetros do `IpcMainInvokeEvent` real quebra a
// checagem de tipos dos fakes usados em teste (ver register-app-handlers.test.ts).
export interface IpcMainLike {
  // `any[]` espelha a assinatura real de `Electron.IpcMain['handle']`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle(channel: string, listener: (event: unknown, ...args: any[]) => unknown): void
}
