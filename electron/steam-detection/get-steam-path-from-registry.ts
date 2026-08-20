import { exec as execCallback } from 'node:child_process'
import { promisify } from 'node:util'

const REGISTRY_KEY = 'HKCU\\Software\\Valve\\Steam'

export type ExecFn = (command: string) => Promise<{ stdout: string }>

const defaultExec: ExecFn = promisify(execCallback)

/**
 * Lê o caminho de instalação da própria Steam do registro do Windows — não assume
 * `Program Files`, já que o usuário pode ter instalado em outro lugar (ver
 * bee8-detectar-instalacao-steam). Usa `reg query` via `child_process` em vez de uma dependência
 * de registro nova, consistente com o resto do projeto.
 */
export async function getSteamPathFromRegistry(execFn: ExecFn = defaultExec): Promise<string | null> {
  try {
    const { stdout } = await execFn(`reg query "${REGISTRY_KEY}" /v SteamPath`)
    const match = /SteamPath\s+REG_SZ\s+(.+)/i.exec(stdout)
    return match ? match[1].trim() : null
  } catch {
    return null
  }
}
