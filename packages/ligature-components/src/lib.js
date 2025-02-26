import { appendText } from "./text/text"
import { run, printResult } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'
import { appendTable } from './table/table.js'
import { appendGraph } from './graph/graph.js'

export {showEditor};

export function runScript(script, element) {
  let res = run(script)
  appendText(element, res)
}

// export function createComponentFns(div) {
//   let actions = new Map()

//   actions.set("display-text", (args) => {
//     if (args.length == 1) {
//       appendText(div, args[0])
//       return ok(tail)
//     } else {
//       throw "display-text requires a single value"
//     }
//   })

//   actions.set("display-table", (args) => {
//     if (args.length == 1) {
//       let network = networkToJs(args[0])
//       appendTable(div, network)
//       return ok(tail)
//     } else {
//       throw "display-table requires a network value"
//     }
//   })

//   actions.set("display-graph", (args) => {
//     if (args.length == 1) {
//       let network = networkToJs(args[0])
//       appendGraph(div, network)
//       return ok(tail)
//     } else {
//       throw "display-graph requires a network value"
//     }
//   })

//   return actions
// }
