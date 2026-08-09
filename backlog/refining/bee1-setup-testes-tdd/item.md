---
id: bee1-setup-testes-tdd
title: "Infraestrutura de testes (Vitest) e fixtures locais"
type: story
status: refining
owner: ""
sistema: infra
domain: BEE-1
domain_title: "Setup & Fundação do Projeto"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee1-setup-testes-tdd · Infraestrutura de testes e fixtures

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | infra |

> Depende de [bee1-setup-electron-react-vite](../bee1-setup-electron-react-vite/item.md).

> Como desenvolvedor, quero Vitest configurado e fixtures de teste que não dependem do `game.lua`
> real do jogo, para poder fazer TDD em todas as histórias sem versionar conteúdo proprietário.

## Contexto
O usuário colocou uma cópia real do `game.lua` (extraída via 7-Zip) na raiz do projeto, **fora do
git** (`.gitignore`), só como referência local pra entender a estrutura real do arquivo — não
pode ser commitada (conteúdo proprietário do jogo). Os testes automatizados do repositório
precisam rodar sem depender desse arquivo existir na máquina: usam fixtures sintéticas,
versionadas em `test/fixtures/`, com snippets Lua que reproduzem a **estrutura** do bloco de
baralhos (formato de tabela, chaves de `config`) sem serem o conteúdo real do jogo.

## Critérios de aceitação
- Vitest configurado, `npm test` roda a suíte completa (main + renderer).
- `test/fixtures/` com pelo menos: um `game.lua` sintético mínimo (com o bloco de baralhos no
  mesmo formato do real) e um `.exe` sintético (stub + ZIP com esse `game.lua` dentro), gerados
  de forma determinística pro motor de BEE-3/BEE-4 testar contra.
- README ou comentário documentando que fixtures são sintéticas por design — nenhum teste do
  repositório deve depender do `game.lua` real do jogo estar presente na máquina.
- CI (ou script local) roda a suíte sem exigir nenhum arquivo fora do git.
