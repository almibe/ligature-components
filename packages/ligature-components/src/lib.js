import { appendText } from "./text/text"
import { run, resultToJs, appendCanvas } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'
import { appendTable } from './table/table.js'
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
