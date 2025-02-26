import { runScript, showEditor } from './lib'

import './style.css'

let initalScript = `{a b c}`

let editor = showEditor(document.querySelector("#editor"), initalScript)

document.querySelector("#runButton")?.addEventListener("click", () => {
//    document.querySelector("#results").innerHTML = ""
    runScript(editor.state.doc.toString(), document.querySelector("#results"))
//    document.querySelector("#results").innerHTML = printResult(res)
})
