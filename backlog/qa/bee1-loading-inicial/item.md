---
id: bee1-loading-inicial
title: "Feedback visual de carregamento inicial"
type: story
status: qa
owner: ""
sistema: ui
domain: BEE-1
domain_title: "Setup & Fundação do Projeto"
priority: P2
labels: [pos-mvp]
created: "09/ago/26"
updated: "09/ago/26"
---
# bee1-loading-inicial · Feedback visual de carregamento inicial

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P2 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | ui |

> Depende de [bee1-setup-electron-react-vite](../../done/bee1-setup-electron-react-vite/item.md).

> Como usuário, quero ver algum indicador de que o app está carregando ao abrir, para saber que
> não travou enquanto a janela ainda não mostra conteúdo.

## Contexto
Pedido pelo usuário — às vezes a janela demora um pouco pra aparecer com conteúdo de verdade.

## Critérios de aceitação
- Barra de carregamento simples (indeterminada, sem % — não temos como calcular progresso real)
  aparece assim que a janela pinta, antes do React montar.
- Some automaticamente assim que a tela real (`SelectExeScreen`) aparece — sem esperar nenhuma
  chamada IPC (`getSettings`, `validateExeFile`) que rodam em segundo plano.
- Não depende do CSS carregado via módulo JS (`index.css`) — precisa aparecer mesmo antes do
  bundle JS terminar de executar, senão não serve pra nada.

## Fora de escopo
- Barra de progresso "de verdade" (com percentual) — não existe uma métrica real de progresso
  pra medir no carregamento de um app Electron já empacotado localmente.

## Progresso
Concluído em 09/ago/26:
- Loader estático direto no `<head>`/`<body>` do `index.html` (CSS inline, não depende de
  `index.css` nem de nenhum módulo JS) — barra fina animada (cor de acento `#f3b542`), dentro de
  `#root`. Como o React substitui todo o conteúdo de `#root` ao montar (`createRoot(...).render`),
  o loader some sozinho no primeiro render — sem JS extra, sem race condition.
- Sem teste automatizado — é HTML/CSS estático fora da árvore React, não há comportamento pra
  testar com Vitest/RTL. Validado conferindo que o `dist/index.html` do build cresceu (0.42kB →
  1.73kB) e contém o markup esperado.
- **Não consegui verificar visualmente** (sem browser/Electron rodando neste ambiente) — vale
  conferir ao abrir o app de verdade, especialmente se o timing do "sumiço" fica suave.
