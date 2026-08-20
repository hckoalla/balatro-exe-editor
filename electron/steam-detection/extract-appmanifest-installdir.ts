// `appmanifest_<appid>.acf` é o mesmo formato VDF de `libraryfolders.vdf`, mas bem mais raso —
// só precisa do campo "installdir" (o nome real da pasta dentro de `steamapps/common/`, que não
// necessariamente bate com o nome do jogo).
export function extractAppmanifestInstallDir(acf: string): string | null {
  const match = /"installdir"\s+"([^"]*)"/.exec(acf)
  return match ? match[1] : null
}
