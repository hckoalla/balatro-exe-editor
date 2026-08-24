import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParsedPokerHand } from '../shared/poker-hand-schema'
import { PokerHandsSaveButton } from './PokerHandsSaveButton'
import './PokerHandsScreen.css'

export interface PokerHandsScreenProps {
  exePath: string
}

type FieldKey = 's_mult' | 's_chips' | 'l_mult' | 'l_chips'

const FIELD_KEYS: FieldKey[] = ['s_mult', 's_chips', 'l_mult', 'l_chips']
const FIELD_LABEL_KEYS: Record<FieldKey, string> = {
  s_mult: 'pokerHands.sMult',
  s_chips: 'pokerHands.sChips',
  l_mult: 'pokerHands.lMult',
  l_chips: 'pokerHands.lChips',
}

// Nenhum campo aqui tem teste empírico ainda (diferente dos campos do MVP) — este limite é um
// ponto de partida provisório, marcado como tal na UI, até uma rodada de teste manual confirmar
// o valor real (ver bee12-editor-niveis-mao-poker).
const PROVISIONAL_LIMIT = 20

export function PokerHandsScreen({ exePath }: PokerHandsScreenProps) {
  const { t } = useTranslation()
  const [original, setOriginal] = useState<ParsedPokerHand[] | null>(null)
  const [hands, setHands] = useState<ParsedPokerHand[] | null>(null)

  useEffect(() => {
    window.balatro.getPokerHands(exePath).then((result) => {
      setOriginal(result)
      setHands(result)
    })
  }, [exePath])

  if (!hands || !original) {
    return <p>{t('decks.loading')}</p>
  }

  function handleFieldChange(handName: string, key: FieldKey, rawValue: string) {
    setHands((prev) =>
      prev!.map((hand) =>
        hand.name === handName
          ? { ...hand, config: { ...hand.config, [key]: Number(rawValue) } }
          : hand,
      ),
    )
  }

  const originalByName = new Map(original.map((hand) => [hand.name, hand.config]))

  return (
    <div className="poker-hands-screen">
      <h1 className="poker-hands-screen__title">{t('pokerHands.title')}</h1>
      <p className="poker-hands-screen__subtitle">{t('pokerHands.subtitle')}</p>

      <div className="poker-hands-screen__grid">
        {hands.map((hand) => {
          const originalConfig = originalByName.get(hand.name)!

          return (
            <div className="poker-hand-card" key={hand.name}>
              <h2 className="poker-hand-card__name">{hand.name}</h2>
              <div className="poker-hand-card__fields">
                {FIELD_KEYS.map((key) => {
                  const value = hand.config[key]
                  const exceeds = Math.abs(value - originalConfig[key]) > PROVISIONAL_LIMIT
                  const inputId = `poker-hand-${hand.name}-${key}`

                  return (
                    <div className="poker-hand-field" key={key}>
                      <label className="poker-hand-field__label" htmlFor={inputId}>
                        {t(FIELD_LABEL_KEYS[key])} — {hand.name}
                      </label>
                      <input
                        id={inputId}
                        type="number"
                        className="poker-hand-field__input"
                        value={value}
                        onChange={(e) => handleFieldChange(hand.name, key, e.target.value)}
                      />
                      {exceeds && (
                        <p className="poker-hand-field__warning">
                          {t('pokerHands.warning', { limit: PROVISIONAL_LIMIT })}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <PokerHandsSaveButton exePath={exePath} hands={hands} />
    </div>
  )
}
