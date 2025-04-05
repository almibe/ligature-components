import { appendText } from "./text/text"
import { run, resultToJs, appendCanvas } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'
import { appendTable } from './table/table.js'
import { appendGraph } from './graph/graph.js'
import { drawNetwork } from "./draw/draw.ts"

export {showEditor};

export function runScript(script, element) {
  let res = run(script)
  let resJs = resultToJs(res)
  if (resJs.type == "record" && resJs.value != undefined && resJs.value.display != undefined) {
    let display = resJs.value.display
    let value = resJs.value.network
    if (display.type == 'term' && display.value == 'table') {
      appendTable(element, value.value)
    } else if (display.type == 'term' && display.value == 'graph') {
      appendGraph(element, value.value)
    } else if (display.type == 'term' && display.value == 'draw') {
      drawNetwork(element, value.value)
    } else if (display.type == 'term' && display.value == 'canvas') {
      appendCanvas(element, res)
    } else {
      appendText(element, res)
    }
  } else {
    appendText(element, res)
  }
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
