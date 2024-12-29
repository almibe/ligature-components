import nearley from "nearley"
import grammar from "./wanderParser.js"
import { Record, Set, Map } from "immutable";
import { Literal, Network, Variable } from "@ligature/ligature";
import { element } from "../ligature/ligature.js";
import { defaultLocals, stdModules } from "./commands.js";


export function parse(script: string) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(script)
  return parser.results[0]
}

export function run(
      script: string, 
      local: Map<Element, Command> = defaultLocals, 
      modules: Map<Element, Map<Element, Command>> = stdModules) {
  let ast = parse(script)
  let result = {}
  for (let statement of ast) {
    if (statement.type == "call") {
      const name = statement.commandName
      let res = local.find((command, ele) => ele.value == name)
      if (res != undefined) {
        result = res(local, modules, Map(), statement.arguments)
      } else {
        throw "Command not found."
      }
    } else {
      throw "unexpected type " + JSON.stringify(statement)
    }
    console.log("running", statement)
  }
  return result
}
