---
id: BEE-1
title: "Setup & Fundação do Projeto"
type: epic
sistema: infra
created: "08/ago/26"
---
# BEE-1 · Setup & Fundação do Projeto

Base técnica do app: Electron + React + Vite + TypeScript, comunicação segura entre main e
renderer, persistência local de configurações, e infraestrutura de testes pra viabilizar TDD
desde a primeira história de código.

Critérios de sucesso:
- App Electron abre com um processo main e um renderer em React + Vite + TypeScript.
- Comunicação main ↔ renderer via IPC tipado, com `contextIsolation` habilitado e preload script
  (sem `nodeIntegration` exposto ao renderer) — o main é quem tem acesso ao sistema de arquivos e
  manipula o `.exe`, o renderer nunca toca arquivo diretamente.
- Configurações do app (último `.exe` usado, idioma escolhido) persistidas localmente via
  `electron-store`, sobrevivendo a reinícios do app.
- Suíte de testes (Vitest) configurada e rodando, com fixtures locais que não dependem do
  `game.lua` real do jogo.
