# Wander Components

## Developing

This project requires [node](https://nodejs.org/en/download/) and [pnpm](https://pnpm.io/) to be installed on your machine.
Once you check out this project run the following commands.

```bash
pnpm install
pnpm run dev
```

## Generated Files

This project uses the parser generator Lezer and generates two files, wander-lezer-parser.js and wander-lezer-parser.terms.js.
Files are generated on build automatically.
For the time being I'm commiting these files to the repo whenever they are regenerated, but make sure to never manually edit them.
