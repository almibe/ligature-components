import { runAndAppendHtml, runAndPrint } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'
import { drawNetwork } from "./draw/draw.ts"

export {showEditor};

export function runScript(script, display, element) {
  if (display == 'network') {
    let res = run(script)
    drawNetwork(element, res.value)
  // } else if (display == 'canvas') {
  //   let res = run(script)
  //   appendCanvas(element, res)
  } else if (display == 'html') {
    runAndAppendHtml(element, script)
    // console.log("res", JSON.stringify(res))
    // appendHtml(element, res)
  } else {
    let res = runAndPrint(script)
    appendText(element, res)
  }
}

export function appendText(element, value) {
    if (element != null) {
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = value
        element.appendChild(pre)
    }
}
