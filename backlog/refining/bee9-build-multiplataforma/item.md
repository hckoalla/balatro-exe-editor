---
id: bee9-build-multiplataforma
title: "Build e empacotamento para macOS/Linux"
type: story
status: refining
owner: ""
sistema: infra
domain: BEE-9
domain_title: "Suporte macOS/Linux (Fase 2)"
priority: P2
labels: [fase2]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee9-build-multiplataforma · Build multiplataforma

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P2 | [BEE-9](../../_epicas/BEE-9.md) · Suporte macOS/Linux (Fase 2) | infra |

> Depende de [bee9-investigar-formato-exe-mac-linux](../bee9-investigar-formato-exe-mac-linux/item.md)
> concluir que é viável.

> Como usuário de macOS ou Linux, quero instalar e rodar o editor na minha plataforma, para não
> precisar de uma máquina Windows só pra customizar meu Balatro.

## Critérios de aceitação
- Electron Builder gera instalável pra macOS e/ou Linux (conforme viabilidade concluída no spike).
- Motor de leitura/escrita adaptado pro(s) formato(s) de distribuição real do jogo na(s)
  plataforma(s) suportada(s).
- Fluxo completo (selecionar jogo → editar baralho → salvar → restaurar) funciona de ponta a
  ponta na plataforma alvo.
