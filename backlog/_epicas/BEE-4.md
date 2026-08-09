---
id: BEE-4
title: "Parsing da Configuração dos Baralhos"
type: epic
sistema: main
created: "08/ago/26"
---
# BEE-4 · Parsing da Configuração dos Baralhos

Dentro do `game.lua`, os 15 baralhos jogáveis + o baralho de desafio ficam definidos num único
bloco de tabela Lua, cada um com uma sub-tabela `config` de chaves opcionais (`dollars`, `hands`,
`discards`, `joker_slot`, `consumable_slot`, `consumables`). Esta épica cobre ler esse bloco pra
uma estrutura de dados editável pelo app, e regravar as alterações de volta no texto do arquivo
sem tocar no resto do `game.lua`.

Critérios de sucesso:
- O bloco de definição dos baralhos é localizado e parseado a partir do texto do `game.lua`,
  extraindo os campos de `config` de cada baralho (presentes ou ausentes).
- As alterações feitas pelo usuário são serializadas de volta no bloco, preservando o resto do
  arquivo byte-a-byte idêntico.
- Existe um catálogo com nome amigável + ID de cada consumível (Tarot/Planeta/Spectral) que pode
  ser usado em `consumables`, pra alimentar o seletor da UI.
