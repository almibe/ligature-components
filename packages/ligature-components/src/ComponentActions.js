import { ok, networkToJs } from "@ligature/ligature";
import { appendStackText, appendText } from "./text/text"
import { headTail } from "@ligature/ligature"
import { appendGraph } from "./graph/graph";
import { appendTable } from "./table/table";

export function createComponentActions(div) {
  let actions = new Map()

  actions.set("display-text", (stack) => {
    let [head, tail] = headTail(stack)
    if (head != undefined) {
      appendText(div, head)
      return ok(tail)
    } else {
      throw "display-text requires a value on the stack"
    }
  })

  actions.set("display-table", (stack) => {
    let [head, tail] = headTail(stack)
    if (head != undefined) {
      let network = networkToJs(head)
      appendTable(div, network)
      return ok(tail)
    } else {
      throw "display-table requires a network value on top of the stack"
    }
  })

  actions.set("display-graph", (stack) => {
    let [head, tail] = headTail(stack)
    if (head != undefined) {
      let network = networkToJs(head)
      appendGraph(div, network)
      return ok(tail)
    } else {
      throw "display-graph requires a network value on top of the stack"
    }
  })

  actions.set("display-stack", (stack) => {
    appendStackText(div, stack)
    return ok(stack)  
  })

  return actions
}
