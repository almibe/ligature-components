import { appendText } from "./text/text"
import { run, resultToJs, appendCanvas, appendHtml } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'
import { appendTable } from './table/table.js'
import { drawNetwork } from "./draw/draw.ts"

export {showEditor};

export function runScript(script, element) {
  let res = run(script)
  let resJs = resultToJs(res)
  if (resJs.type == "node") {
    let display = resJs.children[0]
    let value = resJs.children[1]
    if (display.type == 'term' && display.value == 'table') {
      appendTable(element, value.value)
    } else if (display.type == 'term' && display.value == 'draw') {
      drawNetwork(element, value.value)
    } else if (display.type == 'term' && display.value == 'canvas') {
      appendCanvas(element, res)
    } else if (display.type == 'term' && display.value == 'html') {
      appendHtml(element, res)
    } else if (display.type == 'term' && display.value == 'test-results') {
      throw "todo"
      //appendTestResults(element, res)
    } else {
      appendText(element, res)
    }
  } else {
    appendText(element, res)
  }
}
