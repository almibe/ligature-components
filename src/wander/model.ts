import { Map } from "immutable"
import nearley from "nearley"
import { defaultLocals, stdModules } from "./commands"
import grammar from "./wanderParser.ts"
import { Variable, Network, Literal } from "../ligature/ligature.js"

export type Call = {
  type: "call",
  commandName: string,
  arguments: WanderValue[]
}

export type WanderValue = Element | Variable | Network | Literal | Quote

export type Quote = WanderValue[]

export type Command = (local: Map<Element, Command>, modules: Map<Element, Map<Element, Command>>, variables: Map<Variable, Element | Literal>, args: WanderValue[]) => WanderValue
