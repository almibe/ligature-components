import './style.css'
import { run } from "@ligature/ligature"
import { showTable } from "./table/table"
import { showText } from './text/text'
import { showGraph } from './graph/graph'
import { showEditor } from './editor/editor'

const initalScript = "(id {a : B, a : C, a b c})"

let editor = showEditor("#editor", initalScript)

function runAndUpdate(text) {
  const entries = run(text)

  showTable(
    "#table", 
    entries
  )
  
  showText(
    "#text",
    entries
  )
  
  showGraph(
    "#graph",
    entries
  )
}

document.querySelector("#runButton")?.addEventListener("click", (e) => {
  runAndUpdate(editor.state.doc.toString())
})

runAndUpdate(initalScript)
