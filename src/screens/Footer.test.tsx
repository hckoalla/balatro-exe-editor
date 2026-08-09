// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('shows the credit line', () => {
    render(<Footer />)

    expect(screen.getByText(/hckoalla/i)).toBeInTheDocument()
  })
})
