import './style.css'
import { run } from "@ligature/ligature"
import { showTable } from "./table/table"
import { showText } from './text/text'
import { showGraph } from './graph/graph'
import { showEditor } from './editor/editor'
import { defaultDisplays, display } from './display/display'

const initalScript = "set meta { display = graph},\nset display { a : B, a : C, a b c }"

let editor = showEditor(document.querySelector("#editor"), initalScript)

const displays = defaultDisplays()

function runAndUpdate(text) {
  const entries = run(text)

  showTable(
    document.querySelector("#table"),
    entries.display
  )
  
  showText(
    document.querySelector("#text"),
    entries.display
  )
  
  showGraph(
    document.querySelector("#graph"),
    entries.display
  )

  display(document.querySelector("#display"), entries, displays)
}

document.querySelector("#runButton")?.addEventListener("click", (e) => {
  runAndUpdate(editor.state.doc.toString())
})

runAndUpdate(initalScript)
