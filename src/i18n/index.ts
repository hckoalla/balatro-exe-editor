import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { ptBR } from './locales/pt-BR'

// Sem backend/language-detector de propósito — init() fica síncrono, importante pros testes de
// componente (useTranslation não pode rodar antes do i18next estar pronto).
i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'pt-BR': { translation: ptBR },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18next
