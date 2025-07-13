import { runAndAppendHtml, runAndPrint } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'

export {showEditor};

export function runScript(script, display, element) {
  if (display == 'html') {
    runAndAppendHtml(element, script)
  } else {
    let res = runAndPrint(script)
    appendText(element, res)
  }
}

function appendText(element, value) {
    if (element != null) {
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = value
        element.appendChild(pre)
    }
}
