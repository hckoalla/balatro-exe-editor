---
id: BEE-3
title: "Motor de Leitura/Escrita do balatro.exe"
type: epic
sistema: main
created: "08/ago/26"
---
# BEE-3 · Motor de Leitura/Escrita do balatro.exe

O Balatro no Windows é distribuído como um executável "fusionado" do LÖVE2D: um stub binário
seguido de um arquivo ZIP concatenado no final do arquivo (é por isso que o 7-Zip consegue abrir
o `.exe` direto). Esta épica cobre o motor que localiza esse ZIP embutido, extrai o `game.lua` e
regrava um `game.lua` modificado de volta no `.exe`, sem corromper o stub nem o restante do
arquivo — automatizando o fluxo manual que hoje o usuário faz no 7-Zip + bloco de notas.

Critérios de sucesso:
- Dado um `.exe` do Balatro válido, o motor localiza o ZIP embutido e extrai o `game.lua` pra
  memória.
- O motor regrava um `game.lua` modificado de volta no mesmo `.exe`, preservando o stub e a
  integridade do ZIP (o jogo continua abrindo normalmente depois da gravação).
- Usuário seleciona o `.exe` via diálogo nativo de arquivo, com validação de que é um `.exe`
  válido do Balatro (contém `game.lua` dentro do ZIP embutido) antes de liberar a edição.
