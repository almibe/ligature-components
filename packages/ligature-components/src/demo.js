import './style.css'
import { runWithFns } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'
//import { appendStackText, appendText } from './text/text'
import { appendTable } from './table/table.js'
import { appendGraph } from './graph/graph.js'
import { createComponentFns } from './actions.js'

let initalScript = `display-text {a b c}`

let editor = showEditor(document.querySelector("#editor"), initalScript)

let actions = createComponentFns(document.querySelector("#results"))

document.querySelector("#runButton")?.addEventListener("click", () => {
    document.querySelector("#results").innerHTML = ""
    runWithFns(actions, editor.state.doc.toString())
})
