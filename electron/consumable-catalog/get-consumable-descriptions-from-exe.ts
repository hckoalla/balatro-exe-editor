import { extractFileFromExe } from '../exe-engine/extract-file-from-exe'
import { parseConsumableDescriptions } from './parse-consumable-descriptions'
import { stripBalatroMarkup } from './strip-balatro-markup'

// Mapeia os códigos de idioma do app (src/i18n/index.ts) pro arquivo de localização
// correspondente do próprio jogo, dentro do ZIP embutido — mesmos 3 idiomas que o app já
// suporta (ver bee5-tooltip-consumiveis).
const LOCALIZATION_FILE_BY_LANGUAGE: Record<string, string> = {
  en: 'localization/en-us.lua',
  'pt-BR': 'localization/pt_BR.lua',
  es: 'localization/es_ES.lua',
}

type ReadFileFn = (path: string) => Promise<Buffer>

/**
 * Extrai as descrições dos consumíveis (Tarot/Planet/Spectral) do próprio `.exe` selecionado
 * pelo usuário, no idioma atual da UI — nunca lança, resolve pra `null` em qualquer falha
 * (idioma sem arquivo mapeado, arquivo ausente/corrompido), e a UI cai pro fallback de mostrar
 * só nome + imagem no tooltip.
 */
export async function getConsumableDescriptionsFromExe(
  exePath: string,
  language: string,
  readFileFn: ReadFileFn,
): Promise<Record<string, string> | null> {
  const localizationEntry = LOCALIZATION_FILE_BY_LANGUAGE[language]
  if (!localizationEntry) return null

  try {
    const exeBuffer = await readFileFn(exePath)
    const localizationLua = extractFileFromExe(exeBuffer, localizationEntry).toString('utf-8')
    const descriptions = parseConsumableDescriptions(localizationLua)

    const result: Record<string, string> = {}
    for (const [id, lines] of descriptions) {
      result[id] = lines.map(stripBalatroMarkup).join(' ')
    }
    return result
  } catch {
    return null
  }
}
