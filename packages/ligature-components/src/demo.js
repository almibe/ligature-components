import { runScript, showEditor } from './lib'

import './style.css'

// let initalScript = `
// { display canvas 
//   width 200 
//   height 200 
//   instructions [
//     [fill-style blue]
//     [fill-rect 10 10 150 100]]}`

// let initalScript = `
// { display table 
//   network (assertions [a b c] [a d e] [w e e])}`

// let initalScript = `
// { display html 
//   { div { p class = "test" "Hello" } { p class = "test2" "Hello 2" } } }`

let initalScript = `
{ display test-results 
  (test-group
  "Main test group."
  (expect-equal "true == true" true true)) }
`.trim()

let editor = showEditor(document.querySelector("#editor"), initalScript)

document.querySelector("#runButton")?.addEventListener("click", () => {
    document.querySelector("#results").innerHTML = ""
    runScript(editor.getValue(), document.querySelector("#results"))
})
