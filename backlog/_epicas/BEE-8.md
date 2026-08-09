---
id: BEE-8
title: "Detecção Automática da Instalação (Fase 2)"
type: epic
sistema: main
created: "08/ago/26"
---
# BEE-8 · Detecção Automática da Instalação (Fase 2)

No MVP, o usuário sempre seleciona o `balatro.exe` manualmente (BEE-3). Esta épica adiciona a
conveniência de detectar automaticamente o caminho da instalação padrão da Steam no Windows,
sugerindo o arquivo em vez de exigir que o usuário procure.

Critérios de sucesso:
- O app sugere automaticamente o caminho do `balatro.exe` quando encontra uma instalação padrão
  da Steam, sem impedir a seleção manual como alternativa.
