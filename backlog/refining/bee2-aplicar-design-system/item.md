---
id: bee2-aplicar-design-system
title: "Aplicar design system (Claude Design) nas telas do app"
type: story
status: refining
owner: ""
sistema: design
domain: BEE-2
domain_title: "Design (Claude Design)"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee2-aplicar-design-system · Aplicar design system nas telas

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-2](../../_epicas/BEE-2.md) · Design (Claude Design) | design |

> Depende de [bee2-prompt-sintese-claude-design](../bee2-prompt-sintese-claude-design/item.md) —
> e do usuário trazer de volta o protótipo gerado pelo Claude Design.

> Como usuário, quero que o app tenha a identidade visual do protótipo gerado pelo Claude Design,
> para deixar de trabalhar com telas sem estilo.

## Contexto
Bloqueada até existir um protótipo real em `design/*.dc.html` — sem ele, não há o que adotar.
Quando o protótipo chegar, esta história extrai as variáveis de tema (cores, fontes) e aplica nos
componentes já construídos até então.

## Critérios de aceitação
- Variáveis de tema (cores, fontes) extraídas do protótipo e centralizadas em CSS global.
- Componentes/telas já implementados até este ponto restilizados conforme o protótipo, sem
  alterar semântica/acessibilidade (labels, roles) — testes existentes continuam passando.
- Nenhuma tela nova é criada nesta história — só estilo sobre o que já existe.
