import './style.css'
import { readNetwork, run, networkToJs } from "@ligature/ligature"
import { showEditor } from './editor/editor'
import { appendStackText, appendText } from './text/text'
import { appendTable } from './table/table'
import { appendGraph } from './graph/graph'
import { componentActions } from './ComponentActions.res.mjs'

let initalScript = `{a b c} display-stack`

let editor = showEditor(document.querySelector("#editor"), initalScript)

document.querySelector("#runButton")?.addEventListener("click", () => {
    run(editor.state.doc.toString(), componentActions(
        (value) => {
            appendStackText(document.querySelector("#results"), value)
        },
        (value) => { 
            appendText(document.querySelector("#results"), value)
        },
        (value) => { 
            appendTable(document.querySelector("#results"), networkToJs(value))
        },
        (value) => { 
            appendGraph(document.querySelector("#results"), networkToJs(value))
        }
    ))
})
