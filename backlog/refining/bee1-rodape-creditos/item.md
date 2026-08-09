---
id: bee1-rodape-creditos
title: "Rodapé de créditos em todas as telas"
type: story
status: refining
owner: ""
sistema: ui
domain: BEE-1
domain_title: "Setup & Fundação do Projeto"
priority: P3
labels: [pos-mvp]
created: "09/ago/26"
updated: "09/ago/26"
---
# bee1-rodape-creditos · Rodapé de créditos em todas as telas

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P3 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | ui |

> Depende de [bee1-setup-electron-react-vite](../../done/bee1-setup-electron-react-vite/item.md).

> Como usuário, quero ver quem fez o app em algum lugar discreto da tela, pra dar o crédito certo.

## Contexto
Pedido pelo usuário como último ajuste antes de fechar o desenvolvimento.

## Critérios de aceitação
- Rodapé fixo na parte de baixo, presente em toda tela (`SelectExeScreen`, `DecksScreen`,
  `DeckEditorScreen`) — implementado uma vez em `App.tsx`, não duplicado em cada tela.
- Texto traduzido (EN/PT-BR/ES), exceto o nome "hckoalla" (nome próprio, não traduz).
- Discreto — não compete visualmente com o conteúdo da tela nem atrapalha os cards da
  `DecksScreen` (que podem chegar perto do rodapé da janela).
