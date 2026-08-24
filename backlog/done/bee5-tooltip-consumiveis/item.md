---
id: bee5-tooltip-consumiveis
title: "Tooltip com imagem maior, nome e descrição do consumível"
type: story
status: done
owner: ""
sistema: ui
domain: BEE-5
domain_title: "Editor de Baralhos (UI)"
priority: P3
labels: [pos-mvp]
created: "20/ago/26"
updated: "20/ago/26"
---
# bee5-tooltip-consumiveis · Tooltip com imagem maior, nome e descrição do consumível

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| done | P3 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Depende de [bee5-imagens-consumiveis](../../qa/bee5-imagens-consumiveis/item.md) — mesmo
> mecanismo de atlas, mesma tela.

> Como usuário, quero passar o mouse sobre o ícone de um consumível e ver uma imagem maior, o
> nome e uma descrição do que ele faz, pra reconhecer a carta sem precisar saber de cor o que
> cada Tarot/Planeta/Spectral faz.

## Contexto

Investigação técnica (20/ago/26): o `.exe` tem, além do `game.lua`, arquivos de **localização**
por idioma (`localization/en-us.lua`, `pt_BR.lua`, `es_ES.lua`, etc. — confirmado no caminho real
do ZIP, sem prefixo `resources/`, diferente do que aconteceu com as texturas em
`bee5-imagens-consumiveis`). Cada um tem, pra cada consumível, nome e texto de efeito:

```lua
-- localization/en-us.lua
c_fool={
    name="The Fool",
    text={
        "Creates the last",
        "{C:tarot}Tarot{} or {C:planet}Planet{} card",
        "used during this run",
        "{s:0.8,C:tarot}The Fool{s:0.8} excluded",
    },
},
```

Confirmado que os 3 idiomas que o app já suporta (`en`/`pt-BR`/`es`) têm arquivo equivalente
(`en-us.lua`, `pt_BR.lua`, `es_ES.lua`), com a mesma estrutura, mesma numeração de linha —
`c_fool` vira `"O Tolo"`/`"El loco"` respectivamente, texto traduzido junto.

O texto usa marcação própria do jogo (`{C:tarot}...{}`, `{s:0.8,C:tarot}...{s:0.8}`, etc.) —
confirmado por amostragem que **nenhuma tag tem chave aninhada** (`{...}` sempre plano, nunca
`{...{...}...}`), então uma regex simples (`/\{[^}]*\}/g`, remover) limpa tudo de forma
uniforme, sem precisar entender o significado de cada tag.

**Limitação conhecida, aceita de propósito**: algumas descrições têm marcadores de valor
dinâmico (`#1#`, `#2#` — ex.: "Creates up to #1# random Tarot cards"), que no jogo de verdade são
substituídos por um valor específico de cada carta (lido de outro lugar do código-fonte, não do
texto de localização). Resolver isso exigiria mapear cada consumível individualmente pro campo
certo do `config` dele — fora de escopo aqui. Os `#N#` ficam como estão (índice cru do
placeholder), não o valor real.

## Critérios de aceitação

- Passar o mouse sobre o ícone de um consumível (nos resultados de busca e nos chips
  selecionados) mostra um tooltip com: imagem maior (recorte nativo do atlas, 71×95px, maior que
  o ícone de 28×37px já exibido), nome, e descrição (texto de `localization/*.lua` limpo da
  marcação do jogo).
- Descrição vem no idioma atual da UI (`en`→`en-us.lua`, `pt-BR`→`pt_BR.lua`, `es`→`es_ES.lua`).
- Fallback gracioso se a descrição não puder ser extraída/decodificada (tooltip mostra só nome +
  imagem, sem quebrar a tela) — mesmo padrão de erro silencioso não-bloqueante já estabelecido.
- Tooltip não usa biblioteca nova — implementação própria (hover + posicionamento CSS),
  consistente com o resto do projeto (poucas dependências).

## Fora de escopo

- Resolver os marcadores `#N#` pro valor real de cada carta — mostrados como estão.
- Tooltip pra jokers — só quando `bee11-jokers-iniciais-challenge` avançar (fase 3).
- Detecção de borda de tela (o tooltip pode cortar perto das bordas da janela) — não tratado
  nesta primeira versão.

## Progresso

Concluído em 20/ago/26. 161 testes passando, tsc/lint limpos.

- `electron/consumable-catalog/parse-consumable-descriptions.ts` (+ teste): parser de linha
  próprio pro formato de `localization/*.lua` — acha `<id>={...text={"linha",...}...}` sem
  precisar rastrear em qual categoria (Tarot/Planet/Spectral) a entrada está (IDs já são
  globalmente únicos).
- `electron/consumable-catalog/strip-balatro-markup.ts` (+ teste): remove qualquer `{...}` de
  forma plana — cobre todas as variantes de marcação encontradas por amostragem no arquivo real
  (`{C:...}`, `{s:...}`, `{X:...,C:...}`, `{E:...}`, `{V:...}`, etc.).
- `electron/consumable-catalog/get-consumable-descriptions-from-exe.ts` (+ teste): orquestra
  tudo — mapeia idioma do app (`en`/`pt-BR`/`es`) pro arquivo certo, extrai do `.exe` via
  `extractFileFromExe`, parseia, limpa e junta as linhas. Nunca lança — `null` em qualquer falha.
- Novo canal IPC `getConsumableDescriptions` (`consumable-catalog:get-descriptions`, recebe
  `filePath` + `language`) — contrato, `preload.ts`, handler, mock global de teste.
- `DeckEditorScreen` busca as descrições via IPC (com `i18n.language` atual) junto com
  catálogo/atlas, refaz a busca se o idioma mudar.
- `ConsumablesEditor`: tooltip em `position: fixed` (não `absolute` — escapa do
  `overflow-y: auto` da lista de resultados, senão cortaria perto da borda do scroll),
  posicionado via `getBoundingClientRect()` do ícone hovado. Mostra sprite em tamanho nativo
  (71×95px, sem escala) + nome + descrição (se disponível). Funciona nos resultados de busca E
  nos chips selecionados. Sem descrição disponível, mostra só nome + imagem.
- **Validado end-to-end contra o `.exe` real** (não só fixture sintética) — os 3 idiomas
  extraídos com sucesso (380 entradas cada), incluindo tradução real: `c_fool` → "Creates the
  last Tarot or Planet card..." (en) / "Cria a última carta de Tarô ou Planeta..." (pt-BR) /
  "Genera la última carta de tarot o de planeta..." (es).
- App testado subindo via `npm run dev` (sem erro relacionado ao código novo — só ruído
  conhecido de cache de GPU do Chromium neste ambiente, não relacionado).
- **Não verificado visualmente** (mesma limitação de sempre neste ambiente) — vale conferir o
  posicionamento do tooltip (pode cortar perto da borda direita/inferior da janela — detecção de
  borda ficou fora de escopo de propósito) e a legibilidade da descrição ao abrir o app de
  verdade.
