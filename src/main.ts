import './style.css'
import { run } from "@ligature/ligature"
import { showEditor } from './editor/editor'
import { defaultDisplays, display } from './display/display'

const initalScript = "let meta { display = graph},\nlet result { a : B, a : C, a b c }"

let editor = showEditor(document.querySelector("#editor"), initalScript)

const displays = defaultDisplays()

function runAndUpdate(text) {
  const entries = run(text)
  display(document.querySelector("#display"), entries, displays)
}

document.querySelector("#runButton")?.addEventListener("click", (e) => {
  runAndUpdate(editor.state.doc.toString())
})

runAndUpdate(initalScript)
