---
id: bee3-reinjetar-game-lua-no-exe
title: "Reinjetar um game.lua modificado no balatro.exe"
type: story
status: done
owner: ""
sistema: main
domain: BEE-3
domain_title: "Motor de Leitura/Escrita do balatro.exe"
priority: P0
labels: [mvp]
created: "08/ago/26"
updated: "09/ago/26"
---
# bee3-reinjetar-game-lua-no-exe · Reinjetar game.lua modificado

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| done | P0 | [BEE-3](../../_epicas/BEE-3.md) · Motor de Leitura/Escrita do balatro.exe | main |

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

## Progresso
Concluído em 09/ago/26, dividido em duas peças:
- `electron/exe-engine/update-game-lua-in-exe.ts`: operação pura em memória (buffer → buffer) —
  regrava a entrada `game.lua` dentro do ZIP (`AdmZip.addFile` já atualiza no lugar quando a
  entrada existe), stub binário preservado byte-a-byte, outras entradas do ZIP intactas.
- `electron/exe-engine/write-exe-to-disk.ts`: escreve o buffer em disco, com `WriteFileFn`
  injetável (mesmo padrão de `KeyValueStore`/`IpcMainLike`) pra testar erro de arquivo travado
  sem precisar travar um arquivo de verdade — `EBUSY`/`EPERM`/`EACCES` viram `FileInUseError`
  com mensagem específica ("feche o Balatro/Steam"), outros erros passam direto.
- 6 testes novos (3 pra cada peça): round-trip, stub intacto, outras entradas do ZIP intactas,
  escrita normal, erro de arquivo travado convertido, erro não relacionado passa direto.
- Reforcei `test/fixtures/build-synthetic-balatro-exe.ts` com suporte a `extraFiles` opcional,
  pra fixtures poderem ter mais de uma entrada no ZIP (retrocompatível).
