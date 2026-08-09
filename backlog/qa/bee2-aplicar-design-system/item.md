---
id: bee2-aplicar-design-system
title: "Fundação de tema do design system (cores, fontes)"
type: story
status: qa
owner: ""
sistema: design
domain: BEE-2
domain_title: "Design (Claude Design)"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee2-aplicar-design-system · Fundação de tema do design system

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P0 | [BEE-2](../../_epicas/BEE-2.md) · Design (Claude Design) | design |

> Depende de [bee2-prompt-sintese-claude-design](../bee2-prompt-sintese-claude-design/item.md) —
> e do protótipo gerado pelo Claude Design já estar em `design/`.

> Como usuário, quero que o app tenha a identidade visual do protótipo gerado pelo Claude Design
> desde a primeira tela real, para nenhuma tela nascer sem estilo e precisar de retrabalho depois.

## Contexto
O protótipo (`design/Balatro EXE Editor.dc.html`) chegou antes de existir qualquer tela real do
app (só há um placeholder em `App.tsx`). Por isso esta história muda de escopo: em vez de
"restilizar telas existentes", ela extrai a **fundação** de tema (variáveis CSS + fontes) pra
cada tela nova (BEE-3/4/5) já nascer estilizada direto a partir do protótipo, sem uma passada de
restilo separada depois.

Tokens extraídos do protótipo:
- Fontes: `Bungee` (display/títulos), `Manrope` (corpo/UI), `JetBrains Mono` (dados
  monoespaçados, ex: caminho do arquivo).
- Fundo: `#0a0710` (base), painéis em `#16111c` / `#1a1420` / `#1c1522` / `#211a29`.
- Acento (ações primárias): `#f3b542`, hover `#ffc766`.
- Texto: `#f4eee2` (títulos), `#a9a0b5` (secundário), `#c9c0d4`, `#736a80`.
- Erro: `#e5484d` / `#ff8388`. Sucesso: `#3fb87f` / `#6fe3ab`.
- Cards com `border-radius` grande (12–20px), painéis com borda sutil
  (`rgba(255,255,255,0.06-0.12)`).

## Critérios de aceitação
- Variáveis de tema (cores, fontes, radius) centralizadas em CSS global (`src/index.css` ou
  equivalente), nomeadas semanticamente (não hardcoded hex espalhado pelos componentes).
- Fontes Bungee, Manrope e JetBrains Mono carregadas.
- Placeholder atual (`App.tsx`) aplica o fundo/tipografia base do tema, só pra confirmar que as
  variáveis carregam corretamente — não é uma tela real.

## Fora de escopo
- Restilizar telas específicas — cada tela nasce estilizada na própria história (BEE-3/4/5),
  direto a partir do protótipo. Esta história não cria nem estiliza telas de produto.
