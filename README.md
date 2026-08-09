# Balatro EXE Editor

App desktop (Electron + React + Vite + TypeScript) que edita o `balatro.exe` diretamente, com
interface amigável, no lugar do fluxo manual de abrir o `.exe` no 7-Zip, extrair `game.lua`,
editar no bloco de notas e reinjetar.

## MVP

Edita, por baralho (dos 15 jogáveis + desafio):
- Dinheiro inicial
- Slots de joker
- Slots de consumível
- Consumíveis iniciais

Com backup automático do `game.lua` original e restauração pro padrão a qualquer momento.

## Backlog

Backlog-as-code em [`backlog/`](backlog/) — ver [`backlog/README.md`](backlog/README.md) pra
convenção completa, e [`.claude/CLAUDE.md`](.claude/CLAUDE.md) pro contexto de domínio e workflow
de desenvolvimento.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Links

- [Nexus Mod](https://www.nexusmods.com/balatro/mods/913);
- [Steam discussions](https://steamcommunity.com/app/2379780/discussions/2/583930834798697183/).
