---
id: BEE-6
title: "Backup & Restauração"
type: epic
sistema: main
created: "08/ago/26"
---
# BEE-6 · Backup & Restauração

Rede de segurança do editor: antes de qualquer gravação, o `game.lua` original do usuário é
preservado, e ele pode restaurar o `.exe` pro estado padrão do jogo a qualquer momento.

Critérios de sucesso:
- Na primeira gravação sobre um `.exe`, o `game.lua` original (intocado) é salvo como backup
  antes de qualquer modificação.
- Usuário tem um botão "restaurar padrão" que reinjeta o `game.lua` original do backup no `.exe`,
  com confirmação explícita (ação destrutiva sobre as edições atuais).
