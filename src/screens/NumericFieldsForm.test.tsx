// @vitest-environment jsdom
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { DeckConfig } from '../shared/deck-schema'
import { NumericFieldsForm } from './NumericFieldsForm'

// NumericFieldsForm é totalmente controlado — precisa de um wrapper com estado pra simular como
// o pai de verdade se comportaria (senão o input "reseta" a cada tecla, já que o React força o
// value de volta pro config antigo passado por prop).
function ControlledHarness({
  initial,
  onChange,
}: {
  initial: DeckConfig
  onChange: (config: DeckConfig) => void
}) {
  const [config, setConfig] = useState(initial)
  return (
    <NumericFieldsForm
      config={config}
      onChange={(next) => {
        setConfig(next)
        onChange(next)
      }}
    />
  )
}

function renderForm(initial: DeckConfig, onChange = vi.fn()) {
  render(<ControlledHarness initial={initial} onChange={onChange} />)
  return { onChange }
}

describe('NumericFieldsForm', () => {
  it('shows the 3 known fields framed as deltas added to the base game value', () => {
    renderForm({})

    expect(screen.getByLabelText(/^starting money$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^joker slots$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^consumable slots$/i)).toBeInTheDocument()
    expect(screen.getAllByText(/added to the base/i).length).toBeGreaterThan(0)
  })

  it('calls onChange with the updated field when the user types a value', async () => {
    const user = userEvent.setup()
    const { onChange } = renderForm({})

    await user.type(screen.getByLabelText(/^starting money$/i), '10')

    expect(onChange).toHaveBeenLastCalledWith({ dollars: 10 })
  })

  it('accepts negative values', async () => {
    const user = userEvent.setup()
    const { onChange } = renderForm({})

    await user.type(screen.getByLabelText(/^joker slots$/i), '-1')

    expect(onChange).toHaveBeenLastCalledWith({ joker_slot: -1 })
  })

  it('shows a soft warning without blocking the field when a value exceeds the known safe limit', async () => {
    const user = userEvent.setup()
    renderForm({})

    await user.type(screen.getByLabelText(/^starting money$/i), '300')

    expect(screen.getByLabelText(/^starting money$/i)).toHaveValue(300)
    expect(screen.getByText(/hasn't been tested/i)).toBeInTheDocument()
  })

  it('clearing a field removes its key from the config', async () => {
    const user = userEvent.setup()
    const { onChange } = renderForm({ dollars: 10 })

    await user.clear(screen.getByLabelText(/^starting money$/i))

    expect(onChange).toHaveBeenLastCalledWith({})
  })

  it('shows a reset button only for fields that differ from the deck default, and it clears just that field', async () => {
    const user = userEvent.setup()
    const { onChange } = renderForm({ dollars: 10, joker_slot: 2 })

    expect(screen.getByRole('button', { name: /reset starting money/i })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /reset consumable slots/i }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /reset starting money/i }))

    expect(onChange).toHaveBeenLastCalledWith({ joker_slot: 2 })
  })
})
