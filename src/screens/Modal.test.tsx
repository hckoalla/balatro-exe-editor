// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders its children', () => {
    render(
      <Modal onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>,
    )

    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose when the overlay (outside the box) is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal onClose={onClose}>
        <p>Modal content</p>
      </Modal>,
    )

    await user.click(screen.getByRole('dialog').parentElement!)

    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose when clicking inside the box', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal onClose={onClose}>
        <p>Modal content</p>
      </Modal>,
    )

    await user.click(screen.getByText('Modal content'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal onClose={onClose}>
        <p>Modal content</p>
      </Modal>,
    )

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
  })
})
