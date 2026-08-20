import { describe, expect, it } from 'vitest'
import { buildSplashHtml } from './build-splash-html'

describe('buildSplashHtml', () => {
  it('is a self-contained document, with no external resources', () => {
    const html = buildSplashHtml('FAKE_BASE64')

    expect(html).not.toMatch(/src=["']https?:/)
    expect(html).not.toMatch(/href=["']https?:/)
  })

  it('embeds the given logo as a base64 data URI', () => {
    const html = buildSplashHtml('FAKE_BASE64')

    expect(html).toContain('data:image/png;base64,FAKE_BASE64')
  })

  it('gives the logo an accessible name', () => {
    expect(buildSplashHtml('FAKE_BASE64')).toContain('alt="Balatro EXE Editor"')
  })
})
