---
id: bee2-prompt-sintese-claude-design
title: "Prompt de síntese para o Claude Design"
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
# bee2-prompt-sintese-claude-design · Prompt de síntese pro Claude Design

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-2](../../_epicas/BEE-2.md) · Design (Claude Design) | design |

> Como usuário, quero um prompt pronto que sintetize tudo que descrevi sobre o editor, para levar
> ao Claude Design e gerar o protótipo visual com a identidade do Balatro — sem eu precisar
> reescrever o contexto do zero.

## Contexto
Esta é a primeira entrega de conteúdo do projeto (não depende de nenhuma outra história de
código). O prompt precisa dar ao Claude Design contexto suficiente pra gerar um protótipo
coerente, sem exigir mais rodadas de pergunta e resposta.

## Critérios de aceitação
O prompt (salvo em `design/prompt-claude-design.md`) cobre:
- **O que é o app**: editor desktop do `balatro.exe`, que troca o fluxo manual (7-Zip + bloco de
  notas) por uma interface amigável.
- **Identidade visual**: look & feel inspirado no Balatro — tema escuro tipo mesa de cassino,
  cartas de baralho, fichas de poker, tipografia/paleta que remetam ao jogo, sem copiar assets
  protegidos por direito autoral (é inspiração, não reprodução).
- **Telas do MVP**: seleção do `.exe` (com estado de erro se inválido), seleção de baralho (lista
  dos 15 baralhos + desafio), formulário de edição (dollars, joker slots, consumable slots,
  editor de consumíveis iniciais com soft-warning visual ao ultrapassar os limites seguros),
  confirmação de gravação, restauração de backup, configurações (idioma).
- **Estados importantes**: soft-warning (não bloqueio) ao ultrapassar limites seguros, confirmação
  antes de ação destrutiva (gravar no `.exe` real / restaurar backup), feedback de sucesso/erro.
- Pede explicitamente protótipo em `.dc.html`, no padrão dos projetos irmãos (`design/*.dc.html`).

## Fora de escopo
- Gerar o protótipo em si — isso é feito pelo Claude Design, fora deste repositório, a partir do
  prompt produzido aqui.
