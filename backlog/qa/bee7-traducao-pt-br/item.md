---
id: bee7-traducao-pt-br
title: "Tradução PT-BR"
type: story
status: qa
owner: ""
sistema: i18n
domain: BEE-7
domain_title: "Internacionalização"
priority: P1
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee7-traducao-pt-br · Tradução PT-BR

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| qa | P1 | [BEE-7](../../_epicas/BEE-7.md) · Internacionalização | i18n |

> Depende de [bee7-infra-i18n](../bee7-infra-i18n/item.md).

> Como usuário brasileiro, quero usar o editor em português, para não depender de inglês pra
> entender os avisos de limite seguro e mensagens de erro.

## Critérios de aceitação
- Todas as chaves de tradução existentes têm equivalente em PT-BR, sem strings faltando (caindo
  no fallback em inglês por omissão, não por escolha).
- Nomes próprios do jogo (baralhos, Tarots, Planetas, Jokers) mantidos em inglês, igual ao jogo
  original — não traduzidos.

## Progresso
Concluído em 09/ago/26:
- `src/i18n/locales/pt-BR.ts`, tipado contra `Messages` (tipo derivado de `en` com folhas
  `string` genéricas — `typeof en` puro não servia, `en` usa `as const` e forçaria os MESMOS
  literais em todo idioma).
- Registrado em `src/i18n/index.ts` como recurso `pt-BR`.
- `src/i18n/locales/completeness.test.ts`: compara o conjunto de chaves de `pt-BR` contra `en`
  (nem falta, nem sobra) e confirma que nenhum valor ficou idêntico ao inglês por esquecimento —
  cobre o critério de aceite de forma automatizada, reaproveitável pra `bee7-traducao-es`.
- Nomes próprios do jogo não aparecem nessas strings (são interpolados via `{{name}}`/`{{path}}`
  em runtime, nunca hardcoded na tradução) — então não tem risco de tradução acidental.
