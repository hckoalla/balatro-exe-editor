---
id: bee1-setup-electron-react-vite
title: "Scaffold do projeto: Electron + React + Vite + TypeScript"
type: story
status: done
owner: ""
sistema: infra
domain: BEE-1
domain_title: "Setup & Fundação do Projeto"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee1-setup-electron-react-vite · Scaffold do projeto

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| done | P0 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | infra |

> Como desenvolvedor, quero um projeto Electron + React + Vite + TypeScript rodando localmente,
> para ter uma base sobre a qual construir o resto do app.

## Contexto
Ponto de partida do projeto — nada existe ainda além deste backlog. Mesma stack usada nos
projetos irmãos (`dark-generator`, `lite-fit`): Electron pra empacotar como app desktop, React +
Vite pro renderer, TypeScript em tudo (main, preload, renderer).

## Critérios de aceitação
- `npm run dev` sobe o app Electron com hot-reload do renderer (Vite) e do processo main.
- Estrutura de pastas separa claramente `electron/` (main + preload) de `src/` (renderer React).
- `tsconfig.json` (renderer) e `tsconfig.node.json` (main/preload) configurados, sem `.js`/`.d.ts`
  soltos gerados ao lado dos `.ts` fonte.
- Lint (ESLint) e format configurados e rodando sem erros no scaffold inicial.
- `npm run build` gera um build de produção (renderer + main/preload) sem erros de tipo.

## Fora de escopo
- Empacotamento final em instalador (`electron-builder` gerando `.exe`) — não é bloqueante pro
  desenvolvimento, pode ser resolvido só quando o MVP estiver fechado.

## Progresso
Concluído em 09/ago/26:
- Scaffold via `create-vite` (template `react-ts`), com `vite-plugin-electron` +
  `vite-plugin-electron-renderer` integrando o processo main/preload ao Vite.
- `electron/main.ts` (janela com `contextIsolation: true`, `nodeIntegration: false`) e
  `electron/preload.ts` (stub — a ponte de IPC tipada de verdade é `bee1-ipc-bridge-tipado`).
- `tsconfig.json` (renderer) + `tsconfig.node.json` (main/preload, `outDir` isolado em
  `.tsc-out/`), ESLint (`eslint.config.mjs`) + Prettier.
- `npm run build` (`tsc -b && vite build`) e `npm run lint` passando sem erros.
- `npm run dev` valida com hot-reload — **gotcha**: se rodar num shell com
  `ELECTRON_RUN_AS_NODE=1` (vaza do próprio Claude Code/VSCode), o Electron abre como Node puro e
  quebra; documentado em `.claude/CLAUDE.md`.

Falta o smoke test manual do usuário (`npm run dev` numa janela real).
