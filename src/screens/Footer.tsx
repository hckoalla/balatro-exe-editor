import { useTranslation } from 'react-i18next'
import './Footer.css'

export function Footer() {
  const { t } = useTranslation()

  return <footer className="app-footer">{t('footer.credit')}</footer>
}
