import { Map } from "immutable"
import { Command, WanderValue, parse } from "./wander"
import { element } from "../ligature/ligature"

export const defaultLocals: Map<Element, Command> = Map(
  [[element("id"), (l, m, v, a) => {
    if (a.length == 1) {
      return a[0]
    } else {
      throw "id command expects one argument."
    }
  }],
  [element("union"), (l, m, v, a) => {
    if (a.length == 2) {
      
      return a[0]
    } else {
      throw "union command expects two arguments."
    }
  }]]
)

export const stdModules = Map()
