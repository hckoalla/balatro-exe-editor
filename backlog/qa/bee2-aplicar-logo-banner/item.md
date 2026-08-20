---
id: bee2-aplicar-logo-banner
title: "Aplicar logo e banner gerados no app"
type: story
status: qa
owner: ""
sistema: ui
domain: BEE-2
domain_title: "Design (Claude Design)"
priority: P3
labels: [pos-mvp]
created: "20/ago/26"
updated: "20/ago/26"
---
# bee2-aplicar-logo-banner · Aplicar logo e banner gerados no app

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P3 | [BEE-2](../../_epicas/BEE-2.md) · Design (Claude Design) | ui |

> Depende de [bee2-prompt-logo-banner](../../qa/bee2-prompt-logo-banner/item.md) — os 4 assets já
> foram gerados a partir do prompt (`logo/*.png`), essa história aplica.

> Como usuário, quero que o logo substitua o ícone padrão do Electron e o banner apareça na tela
> inicial, em vez desses assets ficarem parados na pasta `logo/` sem uso.

## Contexto

4 imagens em `logo/` (ainda não commitadas):
- `logo_v1.png` (430×471px) — vai virar o ícone do executável.
- `banner_v1.png` (1496×197px, faixa larga e baixa) — vai pra tela inicial (`SelectExeScreen`).
- `header_v1.png` (1039×572px) — reservado pro Nexus Mods (fora do app, não aplicado aqui).
- `raw_v1.png` (1536×1024px) — geração original/bruta, commitada só como histórico, sem uso
  funcional.

Nenhuma dessas imagens é conteúdo proprietário do jogo (são geradas a partir do
`logo/prompt-logo-banner.md`) — diferente de `textures/`/`fonts/`/etc., **podem e devem ser
versionadas**.

**Terceiro ponto analisado (além dos dois pedidos pelo usuário)**: reaproveitar `logo_v1.png` na
splash screen (`bee1-splash-nativa`), que hoje só mostra um spinner + o texto "BALATRO EXE
EDITOR" — trocar o texto pela marca de verdade é barato (mesmo asset, um `<img>` a mais) e reforça
a identidade visual desde o primeiro instante que o app abre. Incluído no escopo.

**Considerado e deixado de fora deste lote** (não pedido, marcado aqui só pra não perder a ideia):
um banner condensado repetido no topo de todas as telas (não só a inicial) — o app hoje não tem
um header/nav compartilhado entre telas (`App.tsx` só tem `app-shell__content` + `Footer`),
criar um exigiria uma mudança estrutural maior. Também: colocar o logo/banner no topo do
`README.md` do GitHub. Nenhum dos dois é feito aqui — ficam como ideia pra outra história, se o
usuário quiser.

## Critérios de aceitação

- **Ícone do executável**: `logo_v1.png` configurado como `build.win.icon` no `package.json` —
  o `.exe` empacotado (`npm run package`) sai com o ícone novo, não o padrão do Electron.
- **Ícone da janela em dev**: `BrowserWindow` (`electron/main.ts`) recebe `icon: logo_v1.png`
  explicitamente — sem isso, `npm run dev` mostra o ícone genérico do Electron na taskbar (só o
  build empacotado pegaria o ícone certo).
- **Banner na tela inicial**: `SelectExeScreen` mostra `banner_v1.png` — substitui o mock
  decorativo atual (`.select-exe-screen__icon-stack`, 3 `<div>` sobrepostos simulando cartas).
- **Splash screen**: `build-splash-html.ts` mostra `logo_v1.png` (embutido como base64, já que a
  splash carrega via `data:` URL, sem acesso ao bundle do Vite) no lugar do texto "BALATRO EXE
  EDITOR" — mantém o spinner.
- `logo_v1.png` e `banner_v1.png` acessíveis em runtime (dev e empacotado) — `logo_v1.png` listado
  em `build.files` do `package.json` (main process lê via `fs`, fora do bundle do Vite);
  `banner_v1.png` importado direto no componente React (Vite já cuida do bundling).
- `logo/raw_v1.png` e `logo/header_v1.png` commitados junto (histórico e uso externo,
  respectivamente) — sem uso funcional no código.

## Fora de escopo

- `header_v1.png` no Nexus Mods — ação do usuário, fora do repositório.
- Banner condensado persistente em todas as telas (não só a inicial).
- Logo/banner no topo do `README.md`.

## Progresso

Concluído em 20/ago/26. 147 testes passando, tsc/lint limpos, `npm run package` testado de
verdade.

- `package.json`: `build.win.icon: "logo/logo_v1.png"` + adicionado em `build.files` (pro main
  process conseguir ler o arquivo em runtime, empacotado — sem isso só existiria no bundle
  fonte).
- `electron/main.ts`: `BrowserWindow` ganha `icon: path.join(__dirname, '../logo/logo_v1.png')`
  — cobre o ícone em `npm run dev` (o `build.win.icon` só vale pro `.exe` empacotado).
- `electron/build-splash-html.ts`: agora recebe `logoBase64` como parâmetro (continua pura,
  testável) e embute um `<img>` no lugar do texto "BALATRO EXE EDITOR", mantendo o spinner.
  `electron/create-splash-window.ts` lê `logo/logo_v1.png` via `readFileSync` (síncrono,
  aceitável — roda uma vez, antes de qualquer coisa aparecer na tela) e converte pra base64.
- `src/screens/SelectExeScreen.tsx`: importa `banner_v1.png` direto (Vite cuida do bundling),
  substitui o mock de 3 `<div>` sobrepostos por um `<img>` real. Precisou criar
  `src/vite-env.d.ts` (nunca existiu no projeto) com `/// <reference types="vite/client" />` —
  sem isso o TS não reconhece import de `.png` como módulo válido.
- `logo/logo_v1.png`, `logo/banner_v1.png`, `logo/header_v1.png`, `logo/raw_v1.png` commitados —
  nenhuma é conteúdo proprietário do jogo (geradas a partir do prompt), diferente de
  `textures/`/`fonts/`/etc.
- **Testado empacotando de verdade**: rodei `npm run package` antes e depois da mudança — o log
  de build tinha `default Electron icon is used  reason=application icon is not set` antes, e
  **não tem mais** depois (confirma que o ícone customizado foi de fato usado, não só
  configurado às cegas). Também confirmei via `@electron/asar` que `logo/logo_v1.png` está
  presente dentro do `app.asar` empacotado, no mesmo caminho relativo que o código espera.
- **Não verificado visualmente** (mesma limitação de sempre neste ambiente — sem captura de tela
  de janela nativa do Windows): vale abrir o app de verdade pra conferir o recorte do ícone (a
  imagem fonte não é quadrada, 430×471, o electron-builder pode ter cortado/preenchido de um
  jeito que só dá pra avaliar olhando) e a proporção do banner na tela inicial.
