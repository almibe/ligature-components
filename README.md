# Wander Components

## Developing

This project requires [node](https://nodejs.org/en/download/) and [pnpm](https://pnpm.io/) to be installed on your machine.
Once you check out this project run the following commands.

```bash
cd wander-components
pnpm install
pnpm run dev
```

## Generated Files

This project uses the parser generator Lezer and generates two files, wander-lezer-parser.js and wander-lezer-parser.terms.js.
Files are generated on build automatically.

The grammar used for Wander is based off of Lezer's example JSON grammar.
https://github.com/lezer-parser/json/blob/main/src/json.grammar
