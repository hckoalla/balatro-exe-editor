# Fixtures — 100% sintéticas

Nada aqui é conteúdo real do jogo. `game.lua` deste diretório usa nomes e IDs de baralho
inventados (`deck_alpha`, `deck_bravo`, ...) — só reproduz o **formato** da tabela de baralhos do
`game.lua` real (`name`, `stake`, `unlocked`, `order`, `pos`, `set`, `config` com `dollars` /
`hands` / `discards` / `joker_slot` / `consumable_slot` / `consumables`, `unlock_condition`),
cobrindo os casos que o parser de `BEE-4` precisa lidar: `config` vazio, cada campo isolado,
campos combinados, deltas negativos, lista de consumíveis (com duplicata), chave desconhecida
(deve ser ignorada, não quebrar o parser), e um baralho "especial" equivalente ao `b_challenge`.

Nenhum teste do repositório depende do `game.lua`/`.exe` real do jogo — só do que está aqui.

Ver `build-synthetic-balatro-exe.ts` pra gerar, a partir de `game.lua`, um `.exe` sintético
(stub fake + ZIP) no mesmo formato do `balatro.exe` real (stub binário + ZIP concatenado), pra
testar o motor de `BEE-3` sem precisar de um `.exe` de verdade.
