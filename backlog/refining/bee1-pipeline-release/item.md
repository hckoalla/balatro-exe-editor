---
id: bee1-pipeline-release
title: "Pipeline de release (GitHub Actions)"
type: story
status: refining
owner: ""
sistema: infra
domain: BEE-1
domain_title: "Setup & Fundação do Projeto"
priority: P2
labels: [pos-mvp]
created: "09/ago/26"
updated: "09/ago/26"
---
# bee1-pipeline-release · Pipeline de release (GitHub Actions)

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P2 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | infra |

> Depende de [bee1-setup-electron-react-vite](../../done/bee1-setup-electron-react-vite/item.md).

> Como usuário do projeto (dev), quero que dar push numa tag de versão dispare o build do
> instalador automaticamente, para não precisar rodar o empacotamento manualmente a cada release.

## Contexto
Pedido pelo usuário depois do MVP fechado, inspirado no workflow que ele já usa no
`dark-generator` (`C:\_GIT\dark-generator\.github\workflows\release.yml`) — mas mais simples
aqui, porque não existe o conceito de variantes básica/pro daquele projeto: só um build.

`bee1-setup-electron-react-vite` já deixou o empacotamento em instalador (`electron-builder`)
como fora de escopo — essa história fecha essa pendência.

## Critérios de aceitação
- Workflow do GitHub Actions dispara ao dar push numa tag `v*` (ex.: `v0.1.0`).
- Antes de buildar, roda type-check (`tsc -b`), lint (`eslint .`) e a suíte de testes (`vitest
  run`) — não builda nem publica nada se algum desses falhar.
- Builda o instalador Windows via `electron-builder`.
- Publica os artefatos gerados como assets de uma GitHub Release (criada automaticamente se não
  existir), com release notes geradas a partir dos commits.
- `npm run build` (usado o tempo todo durante o desenvolvimento pra verificar type-check) continua
  rápido e não passa a rodar o `electron-builder` — o empacotamento fica num script separado.

## Fora de escopo
- Assinatura de código (o instalador vai sair "não assinado" — normal pra um projeto solo/fan
  tool, mesma decisão do `dark-generator`).
- Build pra macOS/Linux — isso é [BEE-9](../../_epicas/BEE-9.md), fase 2, e depende do spike de
  viabilidade que ainda não rodou.
