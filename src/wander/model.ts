import { Map } from "immutable"
import nearley from "nearley"
import { defaultLocals, stdModules } from "./commands"
import grammar from "./wanderParser.js"
import { Variable, Network } from "../ligature/ligature.js"

type Call = {
  type: "call",
  commandName: string,
  arguments: any[]
}

export type WanderValue = Element | Variable | Network | Literal | Quote

type Quote = WanderValue[]

export type Command = (local: Map<Element, Command>, modules: Map<Element, Map<Element, Command>>, variables: Map<Variable, Element | Literal>, args: WanderValue[]) => WanderValue
