---
id: bee3-reinjetar-game-lua-no-exe
title: "Reinjetar um game.lua modificado no balatro.exe"
type: story
status: refining
owner: ""
sistema: main
domain: BEE-3
domain_title: "Motor de Leitura/Escrita do balatro.exe"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee3-reinjetar-game-lua-no-exe · Reinjetar game.lua modificado

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| refining | P0 | [BEE-3](../../_epicas/BEE-3.md) · Motor de Leitura/Escrita do balatro.exe | main |

> Depende de [bee3-extrair-game-lua-do-exe](../bee3-extrair-game-lua-do-exe/item.md).

> Como desenvolvedor, quero regravar um `game.lua` modificado de volta dentro do `.exe`, para
> persistir as edições do usuário sem corromper o jogo.

## Contexto
Equivalente automatizado do passo manual "arrastar o `game.lua` editado de volta pro 7-Zip". O
stub binário (prefixo antes do ZIP) precisa permanecer byte-a-byte idêntico — só o conteúdo do
ZIP muda.

## Critérios de aceitação
- Dado o buffer de um `.exe` e um novo conteúdo de `game.lua`, retorna um novo buffer de `.exe`
  com o `game.lua` atualizado dentro do ZIP e o stub binário inalterado.
- O `.exe` resultante continua sendo um ZIP válido (outros arquivos do jogo dentro do ZIP
  permanecem intactos).
- Se o arquivo de destino estiver aberto/travado por outro processo (Balatro ou Steam rodando) na
  hora de escrever em disco, retorna um erro claro e específico (não um erro genérico de I/O) —
  pra UI poder mostrar "feche o jogo antes de salvar" (ver `bee5-salvar-alteracoes`).
- Testado contra o `.exe` sintético de `bee1-setup-testes-tdd`: extrai, modifica, reinjeta,
  extrai de novo e confirma que o conteúdo bate.
