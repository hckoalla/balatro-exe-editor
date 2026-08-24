import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeckEditorTab } from './DeckEditorTab'
import { BatchEditTab } from './BatchEditTab'
import { PokerHandsScreen } from './PokerHandsScreen'
import { SettingsScreen } from './SettingsScreen'
import './MainTabs.css'

export interface MainTabsProps {
  exePath: string
}

type Tab = 'deckEditor' | 'batchEdit' | 'pokerHands' | 'settings'

export function MainTabs({ exePath }: MainTabsProps) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('deckEditor')

  return (
    <div className="main-tabs">
      <div className="main-tabs__bar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'deckEditor'}
          className={`main-tabs__tab${tab === 'deckEditor' ? ' main-tabs__tab--active' : ''}`}
          onClick={() => setTab('deckEditor')}
        >
          {t('tabs.deckEditor')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'batchEdit'}
          className={`main-tabs__tab${tab === 'batchEdit' ? ' main-tabs__tab--active' : ''}`}
          onClick={() => setTab('batchEdit')}
        >
          {t('tabs.batchEdit')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'pokerHands'}
          className={`main-tabs__tab${tab === 'pokerHands' ? ' main-tabs__tab--active' : ''}`}
          onClick={() => setTab('pokerHands')}
        >
          {t('tabs.pokerHands')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'settings'}
          className={`main-tabs__tab${tab === 'settings' ? ' main-tabs__tab--active' : ''}`}
          onClick={() => setTab('settings')}
        >
          {t('tabs.settings')}
        </button>
      </div>

      <div className="main-tabs__content">
        {tab === 'deckEditor' && <DeckEditorTab exePath={exePath} />}
        {tab === 'batchEdit' && <BatchEditTab exePath={exePath} />}
        {tab === 'pokerHands' && <PokerHandsScreen exePath={exePath} />}
        {tab === 'settings' && <SettingsScreen exePath={exePath} />}
      </div>
    </div>
  )
}
