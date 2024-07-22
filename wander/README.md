# Wander

## Developing

This project requires [node](https://nodejs.org/en/download/) and [pnpm](https://pnpm.io/) to be installed on your machine.
Once you check out this project run the following commands.

```bash
pnpm install
pnpm test
pnpm run dev
```

## Generated Files

This project uses the parser generator [Lezer](https://lezer.codemirror.net/) and generates two files,
wander-lezer-parser.js and wander-lezer-parser.terms.js.
These files are generated during build automatically and are in the gitignore file.

The grammar used for Wander is based off of Lezer's example JSON grammar.
https://github.com/lezer-parser/json/blob/main/src/json.grammar
