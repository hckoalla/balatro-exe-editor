---
id: bee5-salvar-alteracoes
title: "Salvar alterações no balatro.exe"
type: story
status: refining
owner: ""
sistema: ui
domain: BEE-5
domain_title: "Editor de Baralhos (UI)"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee5-salvar-alteracoes · Salvar alterações no balatro.exe

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-5](../../_epicas/BEE-5.md) · Editor de Baralhos (UI) | ui |

> Depende de [bee4-serializar-bloco-baralhos](../bee4-serializar-bloco-baralhos/item.md),
> [bee3-reinjetar-game-lua-no-exe](../bee3-reinjetar-game-lua-no-exe/item.md),
> [bee5-formulario-valores-numericos](../bee5-formulario-valores-numericos/item.md),
> [bee5-editor-consumiveis-iniciais](../bee5-editor-consumiveis-iniciais/item.md) e
> [bee6-backup-automatico-primeira-edicao](../../refining/bee6-backup-automatico-primeira-edicao/item.md).

> Como usuário, quero salvar minhas edições direto no `balatro.exe`, para não precisar mais abrir
> 7-Zip nem bloco de notas.

## Contexto
Ponto onde tudo se conecta: pega os baralhos editados na UI, serializa (BEE-4) e regrava no
`.exe` real (BEE-3) — depois de garantir que existe backup (BEE-6).

## Critérios de aceitação
- Botão "Salvar" pede confirmação explícita antes de gravar (ação sobre o jogo real do usuário),
  avisando que o Balatro precisa estar fechado.
- Ao confirmar, garante que o backup do `game.lua` original existe (dispara
  `bee6-backup-automatico-primeira-edicao` se for a primeira gravação) antes de escrever.
- Sucesso mostra feedback claro de que a gravação funcionou.
- Erro (arquivo travado por outro processo, permissão negada, etc.) mostra mensagem específica e
  acionável — não trava o app nem perde as edições não salvas do formulário.
