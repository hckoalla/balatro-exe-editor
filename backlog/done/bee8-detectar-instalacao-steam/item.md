---
id: bee8-detectar-instalacao-steam
title: "Detectar automaticamente a instalação do Balatro via Steam"
type: story
status: done
owner: ""
sistema: main
domain: BEE-8
domain_title: "Detecção Automática da Instalação (Fase 2)"
priority: P1
labels: [fase2]
created: "08/ago/26"
updated: "08/ago/26"
---
# bee8-detectar-instalacao-steam · Detectar instalação via Steam

| Estado | Prioridade | Épica | Sistema |
|---|---|---|---|
| done | P1 | [BEE-8](../../_epicas/BEE-8.md) · Detecção Automática da Instalação (Fase 2) | main |

> Como usuário, quero poder escolher entre localizar o `balatro.exe` manualmente ou pedir pro app
> tentar detectar automaticamente (se eu tenho o jogo instalado via Steam), em vez de só um dos
> dois caminhos.

## Contexto
No MVP (`bee3-selecionar-arquivo-exe`), a seleção é sempre manual. Esta história adiciona
detecção automática do caminho padrão de instalação da Steam no Windows, como sugestão — não
substitui a seleção manual.

**Refinado em 19/ago/26** — cadeia de detecção confirmada empiricamente (não só documentação,
testada na máquina real do usuário):

1. Registro `HKEY_CURRENT_USER\Software\Valve\Steam`, valor `SteamPath` → pasta de instalação da
   Steam em si (pode ser customizada pelo usuário — por isso ler do registro, não assumir
   `Program Files`).
2. `<SteamPath>\steamapps\libraryfolders.vdf` — formato VDF (Valve, não JSON), lista todas as
   **bibliotecas Steam** configuradas (podem estar em drives diferentes) e os App IDs instalados
   em cada uma.
3. App ID do Balatro: **2379780** (mesmo ID da URL do Steam Community já linkada no README).
4. Pra cada biblioteca listada, checar se existe `steamapps\appmanifest_2379780.acf` — se existir,
   ler o campo `"installdir"` dele (confirmado: `"Balatro"`) pra montar o caminho final:
   `<biblioteca>\steamapps\common\<installdir>\Balatro.exe`.

Decisão de escopo: verificar **todas** as bibliotecas do `libraryfolders.vdf`, não só a
principal — cobre quem tem a Steam configurada pra instalar jogos grandes em outro drive.

Mecanismo de leitura do registro sugerido: `reg query` via `child_process` (comando nativo do
Windows, sem dependência nova) — consistente com o resto do projeto, que evita módulos nativos
adicionais.

**UX (19/ago/26)**: a detecção **não roda sozinha** ao abrir a tela — é uma ação explícita do
usuário, um botão próprio ("Detectar automaticamente" ou similar) ao lado do botão de busca
manual já existente (`selectExe.browse`, em `SelectExeScreen.tsx`). O usuário escolhe entre os
dois caminhos, nenhum tem prioridade automática sobre o outro. Diferente do comportamento já
existente de sugerir o último `.exe` usado (`suggestLastUsedPath`, que roda no mount da tela) —
esse continua automático, é sobre reabrir o app; a detecção via Steam é sobre a primeira vez.

## Critérios de aceitação
- App lê `SteamPath` do registro (`HKEY_CURRENT_USER\Software\Valve\Steam`) — não assume
  `Program Files`.
- Lê `libraryfolders.vdf` e verifica **todas** as bibliotecas listadas, não só a principal.
- Localiza o Balatro pelo App ID (`2379780`, via `appmanifest_2379780.acf`) em qualquer
  biblioteca onde o `.acf` exista.
- `SelectExeScreen` mostra dois caminhos igualmente disponíveis, nenhum automático por padrão:
  o botão de busca manual já existente (`selectExe.browse`) e um novo botão "Detectar
  automaticamente" que só roda a cadeia de detecção Steam quando clicado.
- Se a detecção encontrar o `.exe`, valida (mesmo fluxo de `handleUseExe`) e segue o mesmo
  caminho de sucesso da seleção manual — não é um resultado de segunda classe.
- Se não encontrar em nenhuma etapa (Steam não instalada, chave de registro ausente, jogo não
  instalado em nenhuma biblioteca, `.acf` ausente/corrompido), mostra um estado de "não
  encontrado" (não um erro de arquivo inválido) e o usuário cai de volta pro botão de busca
  manual sem travar a tela.

## Progresso

Concluído em 20/ago/26. 145 testes passando, tsc/lint limpos, build de produção ok.

- `electron/steam-detection/` (novo, 4 arquivos + testes):
  - `get-steam-path-from-registry.ts` — `reg query "HKCU\Software\Valve\Steam" /v SteamPath` via
    `child_process` (injetável, testável sem shell real). `null` se a chave não existir.
  - `parse-vdf-library-paths.ts` — parser mínimo pro formato VDF (KeyValues da Valve, não JSON)
    de `libraryfolders.vdf`, sob medida pro que a detecção precisa (campo `"path"` de cada
    biblioteca numerada), mesmo espírito do parser de baralho do `game.lua`.
  - `extract-appmanifest-installdir.ts` — extrai `"installdir"` de `appmanifest_2379780.acf`.
  - `detect-balatro-via-steam.ts` — orquestra os três acima: registro → todas as bibliotecas do
    `.vdf` → `.acf` por biblioteca → `Balatro.exe`. Nunca lança, `null` em qualquer falha.
  - Testes usam o conteúdo **real** do `libraryfolders.vdf`/`appmanifest_2379780.acf` capturados
    da máquina do usuário durante o refinamento, como fixture.
- Novo canal IPC `detectExeViaSteam` (`exe:detect-steam`) — contrato, `preload.ts`, handler
  (`register-exe-handlers.ts`, com deps reais wireadas em `main.ts`: `readFile`/`access` do
  `node:fs/promises`) e mock global de teste.
- `SelectExeScreen`: novo botão "Detectar automaticamente (Steam)" ao lado do "Procurar" — só
  roda a detecção quando clicado (não no mount da tela). Sucesso segue o mesmo
  `handleUseExe` da seleção manual. Falha mostra um aviso neutro (`.select-exe-screen__notice`,
  não o box vermelho de erro) — "não encontrado" é um estado diferente de "arquivo inválido".
  Chaves i18n novas (`selectExe.detectSteam`, `selectExe.steamNotFound`) nos 3 idiomas.
- **Validado end-to-end na máquina real do usuário** (não só com fakes/mocks) — rodei a cadeia
  completa via script (`tsx`, descartado depois) e o resultado bateu exatamente:
  `C:\Program Files (x86)\Steam\steamapps\common\Balatro\Balatro.exe`.
- **Não verificado visualmente na UI** (sem captura de tela de janela nativa neste ambiente,
  mesma limitação de `bee1-splash-nativa`/`bee5-imagens-consumiveis`) — a lógica de detecção em
  si já está confirmada real, só o botão/aviso na tela vale conferir ao abrir o app de verdade.
