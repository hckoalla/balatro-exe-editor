---
id: bee9-investigar-formato-exe-mac-linux
title: "Spike: viabilidade de suporte a macOS/Linux"
type: spike
status: cancelled
owner: ""
sistema: infra
domain: BEE-9
domain_title: "Suporte macOS/Linux (Fase 2)"
priority: P2
labels: [fase2]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee9-investigar-formato-exe-mac-linux · Spike: viabilidade macOS/Linux

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| cancelled | P2 | [BEE-9](../../_epicas/BEE-9.md) · Suporte macOS/Linux (Fase 2) | infra |

> Como desenvolvedor, quero investigar como o Balatro é distribuído em macOS e Linux, para saber
> se o motor de BEE-3/BEE-4 pode ser reaproveitado ou precisa de um caminho totalmente diferente
> antes de prometer suporte multiplataforma.

## Contexto
O motor do MVP (BEE-3) assume o formato "fusionado" do LÖVE2D no Windows (stub + ZIP). Em macOS o
jogo tipicamente vem como `.app` bundle (o `game.lua` pode estar em outro caminho dentro do
bundle, não concatenado a um binário); em Linux a distribuição pode variar (`.love` standalone,
AppImage). Não dá pra saber o esforço real sem checar.

## Critérios de aceitação (de investigação, não de código)
- Documenta onde o `game.lua` fica em pelo menos uma instalação real (ou imagem/build) de macOS e
  de Linux.
- Conclui se o motor de extração/injeção pode ser generalizado (ex: uma camada de abstração por
  plataforma) ou se precisa de implementações totalmente separadas.
- Resultado registrado como decisão em `bee9-build-multiplataforma` (ou cancela a história, se a
  investigação concluir que não vale o esforço).

## Cancelamento (19/ago/26)
Não tem demanda real ainda — nenhum usuário pediu suporte macOS/Linux, era escopo especulativo do
planejamento inicial da fase 2. Não é avaliação de que a ideia é ruim; é só falta de necessidade
concreta até agora. Se alguém pedir, essa história volta a fazer sentido — não precisa recriar do
zero, só tirar de `cancelled/`.
