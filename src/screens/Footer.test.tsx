// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('shows the credit line with the app version once it resolves', async () => {
    vi.mocked(window.balatro.getAppVersion).mockResolvedValue('0.1.0')

    render(<Footer />)

    expect(await screen.findByText('by hckoalla - v0.1.0')).toBeInTheDocument()
  })

  it('shows the name alone before the version resolves', () => {
    vi.mocked(window.balatro.getAppVersion).mockReturnValue(new Promise(() => {}))

    render(<Footer />)

    expect(screen.getByText('by hckoalla')).toBeInTheDocument()
  })
})
