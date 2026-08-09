import { writeFile } from 'node:fs/promises'

export class FileInUseError extends Error {
  constructor(filePath: string, cause: unknown) {
    super(
      `"${filePath}" is in use by another program — close Balatro (and Steam, if running) before saving.`,
      { cause },
    )
    this.name = 'FileInUseError'
  }
}

type WriteFileFn = (path: string, data: Buffer) => Promise<void>

const defaultWriteFile: WriteFileFn = (path, data) => writeFile(path, data)

/**
 * Grava o `.exe` atualizado em disco. Erros de arquivo travado (Balatro/Steam com o processo
 * aberto) viram `FileInUseError`, pra UI mostrar uma mensagem específica em vez de um erro
 * genérico de I/O — ver bee5-salvar-alteracoes.
 */
export async function writeExeToDisk(
  filePath: string,
  exeBuffer: Buffer,
  writeFileFn: WriteFileFn = defaultWriteFile,
): Promise<void> {
  try {
    await writeFileFn(filePath, exeBuffer)
  } catch (error) {
    if (isFileLockError(error)) {
      throw new FileInUseError(filePath, error)
    }
    throw error
  }
}

function isFileLockError(error: unknown): boolean {
  const code = (error as NodeJS.ErrnoException)?.code
  return code === 'EBUSY' || code === 'EPERM' || code === 'EACCES'
}
