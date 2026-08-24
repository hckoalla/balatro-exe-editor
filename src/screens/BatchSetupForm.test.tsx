// @vitest-environment jsdom
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { BatchDeckSetup } from './BatchSetupForm'
import { BatchSetupForm } from './BatchSetupForm'

function ControlledHarness({
  initial,
  onChange,
}: {
  initial: BatchDeckSetup
  onChange: (setup: BatchDeckSetup) => void
}) {
  const [setup, setSetup] = useState(initial)
  return (
    <BatchSetupForm
      setup={setup}
      onChange={(next) => {
        setSetup(next)
        onChange(next)
      }}
    />
  )
}

function renderForm(initial: BatchDeckSetup = {}, onChange = vi.fn()) {
  render(<ControlledHarness initial={initial} onChange={onChange} />)
  return { onChange }
}

describe('BatchSetupForm', () => {
  it('shows the 3 numeric fields as plain absolute values, not deltas', () => {
    renderForm()

    expect(screen.getByLabelText(/^starting money$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^joker slots$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^consumable slots$/i)).toBeInTheDocument()
    expect(screen.queryByText(/added to the base/i)).not.toBeInTheDocument()
  })

  it('calls onChange with the updated field when the user types a value', async () => {
    const user = userEvent.setup()
    const { onChange } = renderForm()

    await user.type(screen.getByLabelText(/^starting money$/i), '50')

    expect(onChange).toHaveBeenLastCalledWith({ dollars: 50 })
  })

  it('shows a soft warning when a value exceeds the known safe limit', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/^starting money$/i), '300')

    expect(screen.getByText(/hasn't been tested/i)).toBeInTheDocument()
  })
})
