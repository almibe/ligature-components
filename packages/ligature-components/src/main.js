import './style.css'
import { readNetwork, run, networkToJs } from "@ligature/ligature"
import { showEditor } from './editor/editor'
import { appendText } from './text/text'
import { appendTable } from './table/table'
import { showGraph } from './graph/graph'
import { componentActions } from './Actions.res.mjs'

let initalScript = `{a b c} display-text`

let editor = showEditor(document.querySelector("#editor"), initalScript)

document.querySelector("#runButton")?.addEventListener("click", () => {
    run(editor.state.doc.toString(), componentActions(
        (value) => { 
            appendText(document.querySelector("#results"), value)
        },
        (value) => { 
            appendTable(document.querySelector("#results"), networkToJs(value))
        },
        (value) => { 
            showGraph(document.querySelector("#results"), networkToJs(value))
        }
    ))
})
