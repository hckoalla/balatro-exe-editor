---
id: bee2-prompt-logo-banner
title: "Prompt de síntese pro logo e banner do app"
type: story
status: qa
owner: ""
sistema: design
domain: BEE-2
domain_title: "Design (Claude Design)"
priority: P3
labels: [pos-mvp]
created: "19/ago/26"
updated: "19/ago/26"
---
# bee2-prompt-logo-banner · Prompt de síntese pro logo e banner do app

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P3 | [BEE-2](../../_epicas/BEE-2.md) · Design (Claude Design) | design |

> Depende de [bee2-aplicar-design-system](../../done/bee2-aplicar-design-system/item.md) (a
> identidade visual já aplicada é a referência pro logo/banner).

> Como usuário, quero um prompt pronto que eu possa levar num gerador de imagem pra criar um
> logo e um banner do app, sem reescrever contexto do zero — igual foi feito pro protótipo geral
> em `bee2-prompt-sintese-claude-design`.

## Contexto

O app hoje usa o ícone padrão do Electron (`build` no `package.json` não tem campo `icon`) e não
tem nenhum banner na UI. O usuário adicionou localmente assets reais do jogo (`fonts/`,
`textures/`, `sounds/`, `shaders/` — agora no `.gitignore`, proprietários, nunca versionados)
que servem de **referência de estilo** (paleta, a fonte pixel-art real do jogo em
`fonts/m6x11plus.ttf`, iconografia de cartas/fichas em `textures/`) pro prompt — mas o logo/banner
gerado precisa ser **arte original**, não reprodução do logo oficial do Balatro
(`textures/localthunk-logo.png` etc.). Mesmo princípio já usado no prompt original de design
(`bee2-prompt-sintese-claude-design`): é inspiração, não cópia — este é um fan tool de terceiros,
distribuído fora dos canais oficiais (Nexus Mods), não pode se passar pelo jogo em si.

## Critérios de aceitação

O prompt (salvo em `logo/prompt-logo-banner.md`) cobre dois entregáveis distintos:

- **Logo**: vai substituir o ícone padrão do Electron (janela, taskbar, instalador). Formato
  quadrado; o prompt pede uma versão-fonte em alta resolução (≥512px) da qual as demais
  resoluções/formatos (`.ico` do Windows) são gerados depois — precisa continuar legível tanto
  em tamanho pequeno (16–32px) quanto grande.
- **Banner**: formato largo, pra usar na tela inicial (`SelectExeScreen`) e repetido (versão
  condensada) no topo de navegação entre as telas — o prompt pede as duas variações (hero +
  condensada), não uma imagem única forçada nos dois contextos.

Além disso, o prompt:
- Referencia a identidade visual já estabelecida (protótipo em
  `design/Balatro EXE Editor.dc.html`, paleta/tipografia já aplicada em
  `bee2-aplicar-design-system`) — logo/banner precisam ser consistentes com o que já está no app.
- Pede explicitamente arte **original**, inspirada no visual do Balatro (paleta, tipografia
  pixel-art, iconografia de cartas/fichas) — não reprodução do logo oficial do jogo nem dos
  assets extraídos localmente.

## Fora de escopo

- Gerar as imagens em si — feito fora deste repo, a partir do prompt produzido aqui.
- Aplicar o logo/banner gerado no app (ícone do `electron-builder`, componente de banner na UI)
  — vira uma história separada quando o asset existir, no mesmo padrão de
  `bee2-aplicar-design-system`.

## Progresso

- Prompt escrito em [`logo/prompt-logo-banner.md`](../../../logo/prompt-logo-banner.md), em
  inglês (mesma convenção do `design/prompt-claude-design.md` original — prompts pra ferramenta
  de geração vão em inglês, mesmo com o resto do projeto em PT-BR).
- Referencia os tokens de design reais já aplicados no app (`src/index.css`), não só uma
  descrição vaga: `--color-bg: #0a0710`, paleta de painéis `#16111c`→`#211a29`,
  `--color-accent: #f3b542`, fonte de display `Bungee`, fonte de corpo `Manrope` — pra garantir
  que o logo/banner gerado bata exatamente com o que já está no app, não com uma reinterpretação
  nova da identidade visual.
- Dois entregáveis cobertos como pedido: logo quadrado (fonte em alta resolução, legível de
  16px a 512px+) e banner em duas variações (hero pra tela inicial, condensada pra navegação
  entre telas) — evita pedir uma imagem única esticada nos dois contextos.
- Reforça explicitamente "arte original, não reprodução" do logo/assets oficiais do jogo — mesmo
  princípio do prompt de design original, mais importante ainda aqui por ser um ícone/marca
  visível fora do app (Nexus Mods, instalador).
