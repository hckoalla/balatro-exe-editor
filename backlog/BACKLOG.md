# Backlog — visão geral

> View gerada — não editar à mão. Atualize movendo pastas entre `refining/`, `ready/`,
> `in-progress/`, `qa/`, `done/`, e as bandejas `cancelled/`, `fase2/`, `blocked/`.

## Contagem por estado

| Estado | Itens |
|---|---|
| refining | 11 |
| ready | 0 |
| in-progress | 0 |
| qa | 1 |
| done | 11 |
| cancelled | 0 |
| fase2 | 4 |
| blocked | 0 |

## MVP — por épica

### [BEE-1](_epicas/BEE-1.md) · Setup & Fundação do Projeto
- [done] bee1-setup-electron-react-vite — P0
- [done] bee1-ipc-bridge-tipado — P0
- [done] bee1-electron-store-config — P0
- [done] bee1-setup-testes-tdd — P0 (furou a fila, saiu antes da IPC — ver seu item.md)

### [BEE-2](_epicas/BEE-2.md) · Design (Claude Design)
- [done] bee2-prompt-sintese-claude-design — P0
- [done] bee2-aplicar-design-system — P0 (rescopo: fundação de tema, não restilo de telas)

### [BEE-3](_epicas/BEE-3.md) · Motor de Leitura/Escrita do balatro.exe
- [done] bee3-localizar-zip-embutido-no-exe — P0
- [done] bee3-extrair-game-lua-do-exe — P0
- [done] bee3-reinjetar-game-lua-no-exe — P0
- [done] bee3-selecionar-arquivo-exe — P0

### [BEE-4](_epicas/BEE-4.md) · Parsing da Configuração dos Baralhos
- [done] bee4-parser-bloco-baralhos — P0
- [qa] bee4-serializar-bloco-baralhos — P0
- [refining] bee4-catalogo-consumiveis — P0

### [BEE-5](_epicas/BEE-5.md) · Editor de Baralhos (UI)
- [refining] bee5-tela-selecao-baralho — P0
- [refining] bee5-formulario-valores-numericos — P0
- [refining] bee5-editor-consumiveis-iniciais — P0
- [refining] bee5-salvar-alteracoes — P0

### [BEE-6](_epicas/BEE-6.md) · Backup & Restauração
- [refining] bee6-backup-automatico-primeira-edicao — P0
- [refining] bee6-restaurar-padrao — P0

### [BEE-7](_epicas/BEE-7.md) · Internacionalização
- [refining] bee7-infra-i18n — P0
- [refining] bee7-traducao-pt-br — P1
- [refining] bee7-traducao-es — P1
- [refining] bee7-seletor-idioma — P1

## Fase 2 — por épica

### [BEE-8](_epicas/BEE-8.md) · Detecção Automática da Instalação (Fase 2)
- [fase2] bee8-detectar-instalacao-steam — P1

### [BEE-9](_epicas/BEE-9.md) · Suporte macOS/Linux (Fase 2)
- [fase2] bee9-investigar-formato-exe-mac-linux — P2 (spike)
- [fase2] bee9-build-multiplataforma — P2

### [BEE-10](_epicas/BEE-10.md) · Editor Avançado de Campos (Fase 2)
- [fase2] bee10-editor-generico-campos-lua — P2

## Ordem sugerida (dependências)

1. **BEE-1** (setup) e **bee2-prompt-sintese-claude-design** em paralelo — nenhuma depende da
   outra, dá pra atacar as duas primeiro.
2. **BEE-3** (motor do `.exe`) → **BEE-4** (parsing dos baralhos) → **BEE-5** (UI do editor).
3. **BEE-6** (backup/restauração) entra assim que `bee3-reinjetar-game-lua-no-exe` existir —
   antes de `bee5-salvar-alteracoes`, que depende dela.
4. ~~**bee2-aplicar-design-system** entra quando o protótipo chegar~~ — protótipo já chegou e a
   fundação de tema já está em `qa/`; cada tela nova (BEE-3/4/5) nasce estilizada direto a partir
   do protótipo em `design/Balatro EXE Editor.dc.html`, sem passada de restilo separada.
5. **BEE-7** (i18n) corre em paralelo, mas cada tela nova já deveria nascer sem string hardcoded.
