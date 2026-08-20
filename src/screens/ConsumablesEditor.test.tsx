// @vitest-environment jsdom
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ConsumableCatalogEntry } from '../shared/consumable-catalog-schema'
import { ConsumablesEditor } from './ConsumablesEditor'

const CATALOG: ConsumableCatalogEntry[] = [
  { id: 'c_fool', name: 'The Fool', category: 'Tarot', pos: { x: 0, y: 0 } },
  { id: 'c_star', name: 'The Star', category: 'Tarot', pos: { x: 1, y: 0 } },
  { id: 'c_mercury', name: 'Mercury', category: 'Planet', pos: { x: 0, y: 3 } },
]

// Componente controlado — mesmo motivo do harness em NumericFieldsForm.test.tsx.
function ControlledHarness({
  catalog,
  originalConsumables,
  initial,
  onChange,
}: {
  catalog: ConsumableCatalogEntry[]
  originalConsumables: string[]
  initial: string[]
  onChange: (consumables: string[]) => void
}) {
  const [consumables, setConsumables] = useState(initial)
  return (
    <ConsumablesEditor
      catalog={catalog}
      originalConsumables={originalConsumables}
      consumables={consumables}
      onChange={(next) => {
        setConsumables(next)
        onChange(next)
      }}
    />
  )
}

function renderEditor(
  initial: string[],
  originalConsumables: string[] = initial,
  onChange = vi.fn(),
) {
  render(
    <ControlledHarness
      catalog={CATALOG}
      originalConsumables={originalConsumables}
      initial={initial}
      onChange={onChange}
    />,
  )
  return { onChange }
}

describe('ConsumablesEditor', () => {
  it('filters the catalog by search and adds the chosen consumable to the list', async () => {
    const user = userEvent.setup()
    const { onChange } = renderEditor([])

    await user.type(screen.getByPlaceholderText(/search/i), 'foo')
    await user.click(await screen.findByRole('option', { name: 'The Fool' }))

    expect(onChange).toHaveBeenLastCalledWith(['c_fool'])
    expect(screen.queryByRole('option', { name: 'The Star' })).not.toBeInTheDocument()
  })

  it('allows adding the same consumable more than once (duplicates allowed)', async () => {
    const user = userEvent.setup()
    const { onChange } = renderEditor(['c_fool'])

    await user.type(screen.getByPlaceholderText(/search/i), 'fool')
    await user.click(await screen.findByRole('option', { name: 'The Fool' }))

    expect(onChange).toHaveBeenLastCalledWith(['c_fool', 'c_fool'])
  })

  it('removes a specific occurrence from the list, not all matching ids', async () => {
    const user = userEvent.setup()
    const { onChange } = renderEditor(['c_fool', 'c_fool'])

    const removeButtons = screen.getAllByRole('button', { name: /remove the fool/i })
    await user.click(removeButtons[0])

    expect(onChange).toHaveBeenLastCalledWith(['c_fool'])
  })

  it('shows a soft warning past ~30 items without blocking further additions', async () => {
    const thirtyOneItems = Array.from({ length: 31 }, () => 'c_fool')
    renderEditor(thirtyOneItems)

    expect(screen.getByText(/hasn't been tested/i)).toBeInTheDocument()
  })

  it('shows the reset-list button only when the list differs from the deck default, resetting to it', async () => {
    const user = userEvent.setup()
    const { onChange } = renderEditor(['c_fool', 'c_fool'], ['c_fool'])

    await user.click(screen.getByRole('button', { name: /reset starting consumables/i }))

    expect(onChange).toHaveBeenLastCalledWith(['c_fool'])
  })

  it('does not show the reset-list button when the list matches the deck default', () => {
    renderEditor(['c_fool'], ['c_fool'])

    expect(screen.queryByRole('button', { name: /reset starting consumables/i })).not.toBeInTheDocument()
  })
})
