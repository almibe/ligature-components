import nearley from "nearley"
import grammar from "./wanderParser.js"

type Call = {
  type: "call",
  commandName: string,
  arguments: any[]
}

export function parse(script: string) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(script)
  return parser.results[0]
}

export function run(script: string) {
  return {}
}
