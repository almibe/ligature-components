import { appendText } from "./text/text"
import { run, resultToJs, appendCanvas, appendHtml } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'
import { appendTable } from './table/table.js'
import { drawNetwork } from "./draw/draw.ts"

export {showEditor};

export function runScript(script, display, element) {
  let res = run(script)
  let resJs = resultToJs(res)
  if (display == 'table') {
    appendTable(element, resJs.value)
  } else if (display == 'network') {
    drawNetwork(element, resJs.value)
  } else if (display == 'canvas') {
    appendCanvas(element, res)
  } else if (display == 'html') {
    appendHtml(element, res)
  } else if (display == 'test-results') {
    throw "todo"
    //appendTestResults(element, res)
  } else {
    appendText(element, res)
  }
}
