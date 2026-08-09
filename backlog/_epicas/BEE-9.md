---
id: BEE-9
title: "Suporte macOS/Linux (Fase 2)"
type: epic
sistema: infra
created: "08/ago/26"
---
# BEE-9 · Suporte macOS/Linux (Fase 2)

Nice-to-have citado pelo usuário: rodar o editor em macOS e Linux. O formato de distribuição do
Balatro nessas plataformas é diferente do `.exe` fusionado do Windows (macOS usa `.app` bundle,
Linux tipicamente `.love`/AppImage) — precisa de investigação antes de comprometer escopo.

Critérios de sucesso:
- Investigação conclui se/como o `game.lua` pode ser extraído e regravado nos formatos de
  distribuição de macOS e Linux, documentando viabilidade e diferenças em relação ao Windows.
- Caso viável, o app builda e roda nessas plataformas via Electron Builder.
