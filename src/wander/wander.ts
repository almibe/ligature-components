import nearley from "nearley"
import grammar from "./wanderParser.js"

export function run(script: string) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed("test arg1 arg2")
  console.log(parser.results)
  return {}
}
