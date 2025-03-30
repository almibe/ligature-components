import { runScript, showEditor } from './lib'

import './style.css'

// let initalScript = `
// { display canvas 
//   width 200 
//   height 200 
//   instructions [
//     [fill-style blue]
//     [fill-rect 10 10 150 100]]}`

let initalScript = `
{ display draw 
  network (network [a b c])}`

let editor = showEditor(document.querySelector("#editor"), initalScript)

document.querySelector("#runButton")?.addEventListener("click", () => {
//    document.querySelector("#results").innerHTML = ""
    runScript(editor.state.doc.toString(), document.querySelector("#results"))
})
