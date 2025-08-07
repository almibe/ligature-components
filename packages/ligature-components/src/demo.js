import { runScript, showEditor } from './lib'

import './style.css'

let initalScript = ` 
  test-group(
  "Main test group."
  expect-equal("true == true" true true))`.trim()

let editor = showEditor(document.querySelector("#editor"), initalScript)

document.querySelector("#runButton")?.addEventListener("click", () => {
    document.querySelector("#results").innerHTML = ""
    runScript(editor.getValue(), document.querySelector("#results"))
})
