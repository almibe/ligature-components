import './style.css'
import { runWithActions, topOfStack } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'
//import { appendStackText, appendText } from './text/text'
import { appendTable } from './table/table.js'
import { appendGraph } from './graph/graph.js'
import { createComponentActions } from './actions.js'

let initalScript = `{a b c} display-table`

let editor = showEditor(document.querySelector("#editor"), initalScript)

let actions = createComponentActions(document.querySelector("#results"))

document.querySelector("#runButton")?.addEventListener("click", () => {
    document.querySelector("#results").innerHTML = ""
    runWithActions(actions, editor.state.doc.toString())
})
