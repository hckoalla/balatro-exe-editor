---
id: bee7-traducao-es
title: "Tradução ES"
type: story
status: done
owner: ""
sistema: i18n
domain: BEE-7
domain_title: "Internacionalização"
priority: P1
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee7-traducao-es · Tradução ES

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| done | P1 | [BEE-7](../../_epicas/BEE-7.md) · Internacionalização | i18n |

> Depende de [bee7-infra-i18n](../bee7-infra-i18n/item.md).

> Como usuário hispanohablante, quero usar o editor em espanhol, para não depender de inglês pra
> entender os avisos de limite seguro e mensagens de erro.

## Critérios de aceitação
- Todas as chaves de tradução existentes têm equivalente em ES, sem strings faltando.
- Nomes próprios do jogo (baralhos, Tarots, Planetas, Jokers) mantidos em inglês, igual ao jogo
  original — não traduzidos.

## Progresso
Concluído em 09/ago/26:
- `src/i18n/locales/es.ts`, registrado em `src/i18n/index.ts` como recurso `es`.
- `completeness.test.ts` virou `describe.each(['pt-BR', 'es'])` — mesmo teste de completude
  reaproveitado pros dois idiomas, sem duplicar a lógica de comparação de chaves.
- 99 testes no total, tudo verde.
