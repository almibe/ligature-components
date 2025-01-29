import './style.css'
import { runWithActions } from "@ligature/ligature"
import { showEditor } from './editor/editor'
//import { appendStackText, appendText } from './text/text'
import { appendTable } from './table/table'
import { appendGraph } from './graph/graph'
import { createComponentActions } from './ComponentActions.js'

let initalScript = `{a b c} display-table`

let editor = showEditor(document.querySelector("#editor"), initalScript)

let actions = createComponentActions(document.querySelector("#results"))

document.querySelector("#runButton")?.addEventListener("click", () => {
    document.querySelector("#results").innerHTML = ""

    runWithActions(actions, editor.state.doc.toString())
    // run(editor.state.doc.toString(), componentActions(
    //     (value) => {
    //         appendStackText(document.querySelector("#results"), value)
    //     },
    //     (value) => { 
    //         appendText(document.querySelector("#results"), value)
    //     },
    //     (value) => { 
    //         appendTable(document.querySelector("#results"), networkToJs(value))
    //     },
    //     (value) => { 
    //         appendGraph(document.querySelector("#results"), networkToJs(value))
    //     }
    // ))
})
