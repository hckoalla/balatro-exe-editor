# Backlog — visão geral

> View gerada — não editar à mão. Atualize movendo pastas entre `refining/`, `ready/`,
> `in-progress/`, `qa/`, `done/`, e as bandejas `cancelled/`, `fase2/`, `fase3/`, `blocked/`.

## Contagem por estado

| Estado | Itens |
|---|---|
| refining | 0 |
| ready | 0 |
| in-progress | 0 |
| qa | 4 |
| done | 28 |
| cancelled | 3 |
| fase2 | 0 |
| fase3 | 1 |
| blocked | 0 |

## MVP — por épica

### [BEE-1](_epicas/BEE-1.md) · Setup & Fundação do Projeto
- [done] bee1-setup-electron-react-vite — P0
- [done] bee1-ipc-bridge-tipado — P0
- [done] bee1-electron-store-config — P0
- [done] bee1-setup-testes-tdd — P0 (furou a fila, saiu antes da IPC — ver seu item.md)
- [done] bee1-pipeline-release — P2 (pós-MVP, pedida pelo usuário)
- [done] bee1-loading-inicial — P2 (pós-MVP, pedida pelo usuário)
- [done] bee1-rodape-creditos — P3 (pós-MVP, pedida pelo usuário)
- [done] bee1-versao-na-ui — P3 (pós-MVP, pedida pelo usuário)
- [done] bee1-splash-nativa — P3 (pós-MVP, evolui bee1-loading-inicial — padrão do dark-generator)
- [qa] bee1-build-portatil — P2 (pós-MVP, pedida pelo usuário — rescopa bee1-pipeline-release,
  implementada 20/ago/26)

### [BEE-2](_epicas/BEE-2.md) · Design (Claude Design)
- [done] bee2-prompt-sintese-claude-design — P0
- [done] bee2-aplicar-design-system — P0 (rescopo: fundação de tema, não restilo de telas)
- [qa] bee2-prompt-logo-banner — P3 (pós-MVP, pedida pelo usuário)

### [BEE-3](_epicas/BEE-3.md) · Motor de Leitura/Escrita do balatro.exe
- [done] bee3-localizar-zip-embutido-no-exe — P0
- [done] bee3-extrair-game-lua-do-exe — P0
- [done] bee3-reinjetar-game-lua-no-exe — P0
- [done] bee3-selecionar-arquivo-exe — P0

### [BEE-4](_epicas/BEE-4.md) · Parsing da Configuração dos Baralhos
- [done] bee4-parser-bloco-baralhos — P0
- [done] bee4-serializar-bloco-baralhos — P0
- [done] bee4-catalogo-consumiveis — P0

### [BEE-5](_epicas/BEE-5.md) · Editor de Baralhos (UI)
- [done] bee5-tela-selecao-baralho — P0
- [done] bee5-formulario-valores-numericos — P0
- [done] bee5-editor-consumiveis-iniciais — P0
- [done] bee5-salvar-alteracoes — P0 (fecha o loop completo do MVP)
- [qa] bee5-imagens-consumiveis — P3 (pós-MVP, pedida pelo usuário — implementada 20/ago/26)

### [BEE-6](_epicas/BEE-6.md) · Backup & Restauração
- [done] bee6-backup-automatico-primeira-edicao — P0 (ver ressalva no item.md sobre o critério 3)
- [done] bee6-restaurar-padrao — P0

### [BEE-7](_epicas/BEE-7.md) · Internacionalização
- [done] bee7-infra-i18n — P0
- [done] bee7-traducao-pt-br — P1
- [done] bee7-traducao-es — P1
- [done] bee7-seletor-idioma — P1

## Fase 2 — por épica

Épicas escopadas pra depois do MVP. Saíram da bandeja `fase2/` e voltaram pro fluxo ativo
(`refining/`) em 19/ago/26, a pedido do usuário — deixaram de estar "paradas" e passam a ser
refinadas de verdade.

### [BEE-8](_epicas/BEE-8.md) · Detecção Automática da Instalação (Fase 2)
- [qa] bee8-detectar-instalacao-steam — P1 (implementada 20/ago/26 — validada end-to-end na
  máquina real do usuário, não só com fakes)

### [BEE-9](_epicas/BEE-9.md) · Suporte macOS/Linux (Fase 2)
- [cancelled] bee9-investigar-formato-exe-mac-linux — P2 (spike — sem demanda real, ver item.md)
- [cancelled] bee9-build-multiplataforma — P2 (sem demanda real, ver item.md)

### [BEE-10](_epicas/BEE-10.md) · Editor Avançado de Campos (Fase 2)
- [cancelled] bee10-editor-generico-campos-lua — P2 (sem demanda real, ver item.md)

### [BEE-11](_epicas/BEE-11.md) · Challenges (Fase 2)
- [fase3] bee11-jokers-iniciais-challenge — P2 (viável — abordagem técnica completa no item.md —
  mas deliberadamente deixada por último, decisão do usuário em 20/ago/26)

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
