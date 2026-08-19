---
id: bee1-splash-nativa
title: "Splash screen nativa (janela separada) no lugar do loader inline"
type: story
status: in-progress
owner: ""
sistema: main
domain: BEE-1
domain_title: "Setup & Fundação do Projeto"
priority: P3
labels: [pos-mvp]
created: "19/ago/26"
updated: "19/ago/26"
---
# bee1-splash-nativa · Splash screen nativa (janela separada) no lugar do loader inline

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| in-progress | P3 | [BEE-1](../../_epicas/BEE-1.md) · Setup & Fundação do Projeto | main |

> Substitui/evolui [bee1-loading-inicial](../../qa/bee1-loading-inicial/item.md).

> Como usuário, quero ver uma splash screen de verdade (sem moldura de janela, com spinner)
> assim que abro o app, em vez de ver a janela principal aparecer vazia/em branco por um
> instante antes do loader interno pintar.

## Contexto

`bee1-loading-inicial` resolveu o problema de forma parcial: um loader estático (CSS inline,
fora do bundle React) dentro do `<body>`/`#root` do próprio `index.html`, que some sozinho
quando o React monta e substitui o conteúdo de `#root`. Funciona, mas a `BrowserWindow`
principal (`electron/main.ts`, `createWindow()`) é criada **sem `show: false`** — ou seja, o
Electron já exibe a janela (com moldura, barra de título, etc.) assim que ela existe, e só
depois carrega o `index.html`. Ainda existe uma janela do SO visível antes de qualquer pixel de
conteúdo (nem que seja o loader) aparecer dentro dela.

Referência: o projeto irmão `dark-generator` (`C:\_GIT\dark-generator\electron\main.ts`) resolve
isso com uma **segunda `BrowserWindow`** dedicada à splash:
- `createSplashWindow()`: janela pequena, `frame: false`, `resizable: false`, `movable: false`,
  `alwaysOnTop: true`, `skipTaskbar: true`, carregando um HTML estático embutido via
  `data:text/html;charset=utf-8,${encodeURIComponent(SPLASH_HTML)}` (spinner CSS + nome do app)
  — não depende do bundle Vite/dev server, abre instantaneamente.
- A janela principal é criada com `show: false` e só aparece no evento `ready-to-show` — nesse
  mesmo instante a splash fecha (`splashWindow.close()`), então a troca é imediata: nunca existe
  um momento em que se vê uma janela principal vazia.

## Critérios de aceitação

- Ao abrir o app, uma janela splash (sem moldura de sistema, pequena, sempre no topo) aparece
  imediatamente — antes de qualquer carregamento do Vite/React.
- A janela principal (`mainWindow`) é criada com `show: false` e só é exibida no evento
  `ready-to-show`; a splash fecha nesse exato momento (sem sobreposição perceptível, sem
  flicker de uma janela vazia).
- O loader inline atual em `index.html` (`bee1-loading-inicial`) é removido — a splash nativa
  cobre o mesmo gap de tempo e o torna redundante.
- Splash funciona igual em dev (`npm run dev`, com o Vite dev server) e em produção
  (`npm run package`).
- Visual da splash consistente com a identidade do app (cores do tema já aplicado, ver
  [BEE-2](../../_epicas/BEE-2.md)) — não precisa copiar o visual do `dark-generator` literalmente,
  só o mecanismo.

## Fora de escopo

- Barra de progresso real (%) — mesma limitação já documentada em `bee1-loading-inicial`: não
  existe uma métrica de progresso real pra medir na inicialização de um app Electron
  empacotado localmente. Splash continua indeterminada (spinner ou animação simples).
