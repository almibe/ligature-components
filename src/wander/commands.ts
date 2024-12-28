import { Map } from "immutable"
import { Command, WanderValue, parse } from "./wander"
import { element } from "../ligature/ligature"

export const defaultLocals: Map<Element, Command> = Map(
  [[element("id"), (l, m, v, a) => {
    return element("test") //TODO return a[0]
  }]]
)

export const stdModules = Map()
