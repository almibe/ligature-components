import { Map } from "immutable"
import { Variable, Network, Literal } from "../ligature/ligature.js"
import {  }

export type Call = {
  type: "call",
  commandName: string,
  arguments: WanderValue[]
}

export type Assignment = {

}

export type Statement = Call | Assignment

export type WanderValue = Element | Variable | Network | Literal | Quote

export type Quote = WanderValue[]

export type Command = (local: Map<Element, Command>, modules: Map<Element, Map<Element, Command>>, variables: Map<Variable, Element | Literal>, args: WanderValue[]) => WanderValue
