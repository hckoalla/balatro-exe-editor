import { describe, expect, it } from 'vitest'
import { buildSplashHtml } from './build-splash-html'

describe('buildSplashHtml', () => {
  it('is a self-contained document, with no external resources', () => {
    const html = buildSplashHtml()

    expect(html).not.toMatch(/src=["']https?:/)
    expect(html).not.toMatch(/href=["']https?:/)
  })

  it('shows the app name', () => {
    expect(buildSplashHtml()).toContain('BALATRO EXE EDITOR')
  })
})
