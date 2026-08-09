---
id: bee1-rodape-creditos
title: "Rodapé de créditos em todas as telas"
type: story
status: qa
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
| qa | P3 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | ui |

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

## Progresso
Concluído em 09/ago/26:
- `Footer` (componente pequeno, `t('footer.credit')`) + chave nova nos 3 idiomas ("Made by
  hckoalla" / "Feito por hckoalla" / "Hecho por hckoalla" — só o nome não traduz).
- `App.tsx` reestruturado: em vez de cada `return` condicional devolver a tela direto, agora
  computa a tela numa variável e envolve tudo num `.app-shell` (flex column, `min-height: 100vh`)
  com o conteúdo em `flex: 1 1 auto; overflow-y: auto` e o rodapé como último item do flex —
  evita duplicar o `<Footer/>` em cada tela.
- **Decisão de design**: comecei pensando em `position: fixed` pro rodapé, mas a grade de 16
  cards da `DecksScreen` quase enche os 800px da janela — um rodapé fixo sobreporia a última
  linha. Troquei pra rodapé em fluxo normal (flex, "empurrado" pro fim), que nunca sobrepõe nada;
  se o conteúdo for mais alto que a janela, `.app-shell__content` rola independente, e o rodapé
  continua visível no fim.
- 1 teste novo do `Footer`. 118 testes no total.
