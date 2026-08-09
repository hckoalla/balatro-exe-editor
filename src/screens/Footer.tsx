import { useEffect, useState } from 'react'
import './Footer.css'

export function Footer() {
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    window.balatro.getAppVersion().then((v) => {
      if (!cancelled) setVersion(v)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <footer className="app-footer">{version ? `by hckoalla - v${version}` : 'by hckoalla'}</footer>
  )
}
